---
title: "Can't enable the archive for 'User' because this user object is synchronized with the on-premises directory"
date: "2018-01-24"
categories: 
  - "microsoft"
---

If you're working with Office 365 and you're enabling Online-Archiving thought Exchange Online this blog is probably going to be useful.

If you are trying to enable Online Archiving for a user using the following command:

**Enable-Mailbox <User> -Archive**

And you receive the response:

**The following error occurred during validation in agent 'Windows LiveId Agent': 'Can't enable the archive for 'John' because this user object is synchronized with the on-premises directory. To enable a cloud-based archive mailbox for this user, you must use your on-premises Exchange admin center or Exchange Management Shell.'**

Its because the user's mailbox was more than likely migrated from an On-Premise exchange.

To validate this check the AD attribute of 'msExchRemoteRecipientType', this attribute is synchronised using AD Sync and tells exchange Online what type of mailbox the user has. An explanation of these values can be found below.

msExchRemoteRecipientType:
1 Provisioned User Mailbox
3 Provisioned User Mailbox, Provisioned Archive
4 Migrated User Mailbox
6 Migrated User Mailbox, Archive created in cloud
20 Migrated User Mailbox, deprovisioned Archive
33 Provisioned Room Mailbox
36 Migrated Room Mailbox
65 Provisioned Equipment Mailbox
68 Migrated Equipment Mailbox
100 Shared Mailbox in EXO

If you amend this attribute and force an AD Sync Exchange Online will automatically configure the Online Archive mailbox.

I wrote a script to handle this for test users and also a whole organisation based on what the msExchRemoteRecipientType is set to.

You will need exchange online admin credentials and also AD rights in order to apply these settings, you are directly modifying the attributes. If you aren't sure what you're doing please make sure you run in test mode and specify only 1 or 2 users.

\[cc lang="powershell"\]
###Script to enable archive mailboxes for specified users

###Edit log file location in log Function below

#\[string\]$Path='C:\\scripts\\Email Archiving\\log

#This option can be passed in with a command but I prefer to set it here, the date and the extension

#will be placed onto the end of the C:\\Scripts\\Email Archiving\\log string to represent C:\\Scripts\\Email Archiving\\log\_2018-01-24.log

#Function to write a log file out

function Write-Log

{ \[CmdletBinding()\]

Param

(

\[Parameter(Mandatory=$true,

ValueFromPipelineByPropertyName=$true)\]

\[ValidateNotNullOrEmpty()\]

\[Alias("LogContent")\]

\[string\]$Message,

\[Parameter(Mandatory=$false)\]

\[Alias('LogPath')\]

\[string\]$Path='C:\\scripts\\Email Archiving\\log',

\[Parameter(Mandatory=$false)\]

\[ValidateSet("Error","Warn","Info")\]

\[string\]$Level="Info",

\[Parameter(Mandatory=$false)\]

\[switch\]$NoClobber

)

Begin

{

# Set VerbosePreference to Continue so that verbose messages are displayed.

$VerbosePreference = 'Continue'

#Append the date to the migration log file

$FormattedDate = Get-Date -Format "yyyy-MM-dd"

$Path = $Path + "\_" + $FormattedDate + ".log"

}

Process

{

# If the file already exists and NoClobber was specified, do not write to the log.

if ((Test-Path $Path) -AND $NoClobber) {

Write-Error "Log file $Path already exists, and you specified NoClobber. Either delete the file or specify a different name."

Return

}

# If attempting to write to a log file in a folder/path that doesn't exist create the file including the path.

elseif (!(Test-Path $Path)) {

Write-Verbose "Creating $Path."

$NewLogFile = New-Item $Path -Force -ItemType File

}

else {

# Nothing to see here yet.

}

# Write message to error, warning, or verbose pipeline and specify $LevelText

switch ($Level) {

'Error' {

Write-Error $Message

$LevelText = 'ERROR:'

}

'Warn' {

Write-Warning $Message

$LevelText = 'WARNING:'

}

'Info' {

Write-Verbose $Message

$LevelText = 'INFO:'

}

}

# Write log entry to $Path

$timeStamp = Get-Date -Format o | foreach {$\_ -replace ":", "."}

"$timeStamp $LevelText $Message" | Out-File -FilePath $Path -Append

}

End

{

}

}

##########################Functions preloaded at the top of the script##########################

#Set test mode on so we can specify users

$testMode = 1

#Specify test users to run the script on - UPN should be supplied

$testUsers = "user1@domain.com", "user2@domain.com"

#Grab exchange online user credentials

$UserCredential = Get-Credential

#Set the exchange powershell session allowing redirection of commands

$Session = New-PSSession -ConfigurationName Microsoft.Exchange -ConnectionUri https://outlook.office365.com/powershell-liveid/ -Credential $UserCredential -Authentication Basic -AllowRedirection

#Import the Powershell session

Import-PSSession $Session

#Import the Powershell session

Import-Module ActiveDirectory

#Evaluate test mode or not

if ($testMode -eq 1) {

#Loop through each test user and enable inplace archive

foreach ($user in $testUsers) {

$searchResult = get-aduser -Filter { UserPrincipalName -Eq $user }

$mailboxStatus = get-aduser $searchResult -properties \* | select -property msExchRemoteRecipientType -ExpandProperty msExchRemoteRecipientType

Write-Host "$user Current Mailbox Status = $mailboxStatus"

if ($mailboxStatus -eq 3) {

Write-Host "$result Current Mailbox Status = $mailboxStatus"

Write-Log "Archiving already enabled for $user - ProvisionedMailbox, ProvisionedArchive (Cloud MBX & Cloud Archive)"

Write-Log "No action performed"

}

if ($mailboxStatus -eq 4) {

Write-Host "$result Current Mailbox Status = $mailboxStatus"

Write-Log "Archiving not enabled for $user - Migrated"

set-aduser $searchResult –replace @{msExchRemoteRecipientType=6}

}

if ($mailboxStatus -eq 6) {

Write-Host "$result Current Mailbox Status = $mailboxStatus"

Write-Log "Archiving enabled for $user - Migrated, ProvisionedArchive (Migrated MBX & Cloud Archive)"

Write-Log "No action performed"

}

if ($mailboxStatus -eq $null) {

Write-Host "No mailbox status in AD"

$user | Enable-Mailbox -Archive

Write-Log " Online user - enabled archiving for this user $user"

}

}

}

else {

#Loop through all user mailboxes without Archiving turned on and enable it

$searchResult = Get-Mailbox -ResultSize "unlimited" -Filter {RecipientTypeDetails -eq "UserMailbox"}

foreach ($result in $searchResult) {

$mailboxStatus = get-aduser $result.Name -properties \* | select -property msExchRemoteRecipientType -ExpandProperty msExchRemoteRecipientType

if ($mailboxStatus -eq 3) {

Write-Host "$result Current Mailbox Status = $mailboxStatus"

Write-Log "Archiving already enabled for $result.Name - ProvisionedMailbox, ProvisionedArchive (Cloud MBX & Cloud Archive)"

Write-Log "No action performed"

}

if ($mailboxStatus -eq 4) {

Write-Host "$result Current Mailbox Status = $mailboxStatus"

Write-Log "Archiving not enabled for $result.Name - Migrated"

set-aduser $result.Name –replace @{msExchRemoteRecipientType=6}

}

if ($mailboxStatus -eq 6) {

Write-Host "$result Current Mailbox Status = $mailboxStatus"

Write-Log "Archiving not enabled for $result.Name - Migrated, ProvisionedArchive (Migrated MBX & Cloud Archive)"

Write-Log "No action performed"

}

if ($mailboxStatus -eq $null) {

Write-Host "No mailbox status in AD"

$result.Name | Enable-Mailbox -Archive

Write-Log " Online user - enabled archiving for this user $result.Name"

}

}

}

#Close connection to exchange

Remove-PSSession $Session

\[/cc\]
