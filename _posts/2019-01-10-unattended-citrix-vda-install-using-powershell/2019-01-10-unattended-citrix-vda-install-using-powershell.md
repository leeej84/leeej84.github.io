---
title: "Unattended Citrix VDA Install using Powershell"
date: "2019-01-10"
categories: 
  - "citrix"
  - "xenapp-and-xendesktop"
---

I recently completed some work to spin up an entire Citrix Virtual Apps and Desktop testing environment in Azure with LoginVSI and FSLogix all installed automatically.

I decided to write this blog post as I stumbled across a thread on twitter about people having some issues deploying the VDA with SCCM due to the multiple reboot issue.

Below are two powershell scripts which I've uploaded which will fulfil this requirement.

Firstly though, a bit of a run through and the process that is necessary for the VDA to be installed.

- The following Roles need to be installed on the Server prior to installing the VDA
    
    - Remote Desktop Session Host
    - .Net Framework 4.7.1 needs to be installed

[https://docs.citrix.com/en-us/citrix-virtual-apps-desktops/system-requirements.html](https://docs.citrix.com/en-us/citrix-virtual-apps-desktops/system-requirements.html){:target="_blank"}

The reason these need to be installed first is to ensure an automated reboot is not triggered during the VDA setup process. (Citrix do have this covered but its interactive on reboot)

To achieve this we need a reboot in-between some of these actions; we utilise windows AutoLogon to ensure that after the reboot period a user is automatically logged on and then the script automatically runs without prompt.

**Script 1:**

- Disables IE Enhanced Security
- Downloads the .Net framework installer from a publicly readable Azure storage account
- Installs the .Net framework installer silently and without a reboot
- Installs all the necessary server roles without a reboot
- Configures windows AutoLogon with a local user account that has administrative access to the local server
- Sets the AutoLogon count to 1
- Sets the Script action for AutoLogon to fire the next script

{% highlight powershell linenos %}
######## 
#Session Server Configuration 
#Copyright: Free to use, please leave this header intact #Author: Leee Jeffries 
#Company: LJC (https://www.leeejeffries.com) #Script help: Designed to be run from Azure ARM Template but can be run standalone 
#Purpose: Installs and Configures Citrix Virtual Apps and all roles automatically and silently 
#Usage: Can be used via SCCM or even manually to fire off an unattended VDA install # Place in folder called C:\CustomPOSH_Scripts 
########

Function Set-AutoLogon{

[CmdletBinding()] 
Param( 
  [Parameter(Mandatory=$True,ValueFromPipeline=$true,ValueFromPipelineByPropertyName=$true)] 
  [String[]]$DefaultUsername, 
  
  [Parameter(Mandatory=$True,ValueFromPipeline=$true,ValueFromPipelineByPropertyName=$true)] 
  [String[]]$DefaultPassword, 
  
  [Parameter(Mandatory=$False,ValueFromPipeline=$true,ValueFromPipelineByPropertyName=$true)] 
  [AllowEmptyString()] 
  [String[]]$AutoLogonCount, 
  
  [Parameter(Mandatory=$False,ValueFromPipeline=$true,ValueFromPipelineByPropertyName=$true)] 
  [AllowEmptyString()] 
  [String[]]$Script )

Begin { 
  #Registry path declaration $RegPath = "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" 
  $RegROPath = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce" }

Process { 
  try { 
    #setting registry values 
    Set-ItemProperty $RegPath "AutoAdminLogon" -Value "1" -type String 
    Set-ItemProperty $RegPath "DefaultUsername" -Value "$DefaultUsername" -type String 
    Set-ItemProperty $RegPath "DefaultPassword" -Value "$DefaultPassword" -type String 
    if($AutoLogonCount) { 
      Set-ItemProperty $RegPath "AutoLogonCount" -Value "$AutoLogonCount" -type DWord 
    } else { 
      Set-ItemProperty $RegPath "AutoLogonCount" -Value "1" -type DWord 
    } 
      if($Script) { 
        Set-ItemProperty $RegROPath "(Default)" -Value "$Script" -type String 
      } else { 
        Set-ItemProperty $RegROPath "(Default)" -Value "" -type String 
      } 
    } catch { 
      Write-Output "An error had occured $Error" 
    } 
  } End { 
    #End 
  } 
}

##Function to grab current script directory 
function Get-Script-Directory { 
  $scriptInvocation = (Get-Variable MyInvocation -Scope 1).Value return Split-Path $scriptInvocation.MyCommand.Path 
}

function Disable-ieESC { 
  $AdminKey = "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A7-37EF-4b3f-8CFC-4F3A74704073}" 
  $UserKey = "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A8-37EF-4b3f-8CFC-4F3A74704073}" 
  Set-ItemProperty -Path $AdminKey -Name "IsInstalled" -Value 0 
  Set-ItemProperty -Path $UserKey -Name "IsInstalled" -Value 0 
  Stop-Process -Name Explorer 
  Write-Host "IE Enhanced Security Configuration (ESC) has been disabled." -ForegroundColor Green 
}

#Disabled IE Enhanced Security 
Disable-ieESC

###################################Variable Configuration###################################

#Download Filenames 
$dotNetFilename = "NDP471-KB4033342-x86-x64-AllOS-ENU.exe"

#Script Run Credentials
#Script user that will be used for AutoLogon 
$secUser = "Domain\\Username"

#Script user password to be used for AutoLogon 
$secPasswd = "Your Password"

#Get Current Script Folder 
$currentFolder = Get-Script-Directory

##Log File configuration 
$logLoc = "C:\CustomPOSH_Logs"

##Download Location 
$downloadLoc = "C:\CustomPOSH_Downloads"

##Location for files to be downloaded 
$downloadFiles = @() 
$downloadFiles += ("https://publicfiledownloads.blob.core.windows.net/downloads/NDP471-KB4033342-x86-x64-AllOS-ENU.exe")

###################################Variable Configuration Complete###################################

##Log Folder Creation 
$null = New-Item -ItemType Directory -Path $logLoc -Force

##Download Folder Creation 
$null = New-Item -ItemType Directory -Path $downloadLoc -Force

#Disable Windows Firewall 
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False

##Loop through the array and download all files 
foreach ($file in $downloadFiles) { 
  #Get filename of downloadable file 
  $fileName = $file.SubString($file.LastIndexOf("/")+1,($file.Length - $file.LastIndexOf("/"))-1) 
  [Net.ServicePointManager]::SecurityProtocol = "tls12, tls11, tls" 
  Invoke-WebRequest -UseBasicParsing -Uri $file -OutFile "$downloadLoc\$fileName"

  #Wait for Windows to complete renaming the file from temp 
  Start-Sleep -Second 5 
}

##Install Remote Desktop Services 
Install-WindowsFeature Remote-Desktop-Services,RDS-RD-Server,RDS-Licensing,RDS-Licensing-UI,RSAT-RDS-Licensing-Diagnosis-UI

##Install .Net Framework 
if (Test-Path "$downloadLoc\\$dotNetFilename") { 
  Start-Process -FilePath $downloadLoc\\$dotNetFilename -ArgumentList "/norestart","/quiet","/q:a" -Wait 
} else { 
  "Could not find DotNet File Download - Perhaps it failed to download, Please install manually" | Out-File -FilePath "$logLoc\\DotNetSetup.log" -Append 
}

#Set AutoLogon 
Set-AutoLogon -DefaultUsername $secUser -DefaultPassword $secPasswd -Script "C:\Windows\System32\WindowsPowershell\V1.0\powershell.exe -ExecutionPolicy Unrestricted -File ""$currentFolder\CitrixSessionServerConfig.ps1""" -AutoLogonCount 1

& shutdown -r -t 05 
{% endhighlight %}

 **Script 2:**

- Script 2 is kicked off by the AutoLogon process
- Disables IE Enhanced Security
- Downloads the XenApp and XenDesktop 7.18 VDA Setup from Azure storage
- Installs the Virtual Delivery Agent in an unattended fashion whilst also specifying the delivery controller(s) in the command line

{% highlight powershell linenos %}
######## 
#Session Server Configuration 
#Copyright: Free to use, please leave this header intact 
#Author: Leee Jeffries #Company: LJC (https://www.leeejeffries.com) 
#Script help: Designed to be run from Azure ARM Template but can be run standalone #Purpose: Installs and Configures Citrix Virtual Apps and all roles automatically and silently #Usage: Used for FSLogix storage testing 
#Place in folder called C:\CustomPOSH_Scripts 
########

##Function to disable IE enhanced security function 
Disable-ieESC { 
  $AdminKey = "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A7-37EF-4b3f-8CFC-4F3A74704073}" 
  $UserKey = "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A8-37EF-4b3f-8CFC-4F3A74704073}" 
  Set-ItemProperty -Path $AdminKey -Name "IsInstalled" -Value 0 Set-ItemProperty -Path $UserKey -Name "IsInstalled" -Value 0 
  Stop-Process -Name Explorer 
  Write-Host "IE Enhanced Security Configuration (ESC) has been disabled." -ForegroundColor Green 
}

#Disabled IE Enhanced Security 
Disable-ieESC

###################################Variable Configuration###################################
##Log File configuration 
$logLoc = "C:\CustomPOSH_Logs"
##Download Location 
$downloadLoc = "C:\CustomPOSH_Downloads"
###################################Variable Configuration Complete###################################

##Location for files to be downloaded 
$downloadFiles = @() 
$downloadFiles += ("https://publicfiledownloads.blob.core.windows.net/downloads/VDAServerSetup\_7.18.exe")

##Log Folder Creation 
$null = New-Item -ItemType Directory -Path $logLoc -Force

##Download Folder Creation 
$null = New-Item -ItemType Directory -Path $downloadLoc -Force

#Disable Windows Firewall 
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False

##Loop through the array and download all files 
foreach ($file in $downloadFiles) { 
  #Get filename of downloadable file 
  $fileName = $file.SubString($file.LastIndexOf("/")+1,($file.Length - $file.LastIndexOf("/"))-1) 
  [Net.ServicePointManager]::SecurityProtocol = "tls12, tls11, tls" 
  Invoke-WebRequest -UseBasicParsing -Uri $file -OutFile "$downloadLoc\$fileName"

  #Wait for Windows to complete renaming the file from temp 
  Start-Sleep -Second 5 
}

##Install XenDesktop 
#Run the XenDesktop Setup 
if (Test-Path "$downloadLoc\VDAServerSetup_7.18.exe") { 
  ##Start the XenDesktop Setup 
  #Start the installation with all the necessary parameters 
  Start-Process -FilePath "$downloadLoc\VDAServerSetup\_7.18.exe" -ArgumentList "/QUIET","/NOREBOOT","/OPTIMIZE","/VERBOSELOG","/COMPONENTS VDA","/CONTROLLERS 'fsx-xdc-01.fslogix.local'","/ENABLE\_HDX\_PORTS","/ENABLE\_REAL\_TIME\_TRANSPORT","/masterimage" -Wait 
} else {     
  "Could not find VDA Setup files - There must have been a problem downloading from the file" | Out-File -FilePath "$logLoc\\VDASetup.log" -Append 
}

& shutdown -r -t 05
{% endhighlight %}

Lastly - please remember to add your controllers to the VDA installation line.

Please feel free to add comments or ask questions, I will do my very best to respond as soon as I can.
