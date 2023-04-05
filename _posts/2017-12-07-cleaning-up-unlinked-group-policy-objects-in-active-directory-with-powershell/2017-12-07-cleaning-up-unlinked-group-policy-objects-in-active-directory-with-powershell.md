---
title: "Cleaning up unlinked Group Policy objects in Active Directory with Powershell"
date: "2017-12-07"
categories: 
  - "microsoft"
---

Just a quick script below to run through all unlinked GPO's in a domain, back them up, export a report and then remove them.

Sweet and short but useful. (# Comment the remove line if you don't want to remove any)

\[cc lang=“Powershell”\] Import-Module GroupPolicy  $backupPath="C:\\Users\\jeffrl-p\\Desktop\\Backup\_GPO"

 if (-Not(Test-Path -Path $backupPath)) {  mkdir $backupPath  }   

Get-GPO -All | Sort-Object displayname | Where-Object { If ( $\_ | Get-GPOReport -ReportType XML | Select-String -NotMatch "" )       

{  $backupReportPath = $backupPath + "\\" + $\_.DisplayName + ".html"  Backup-GPO -Name $\_.DisplayName -Path $backupPath  Get-GPOReport -Name $\_.DisplayName -ReportType Html -Path $backupReportPath    $\_.DisplayName | Out-File $backupPath + "UnLinked\_GPO\_List.txt" -Append  $\_.Displayname | remove-gpo -Confirm  }  } \[/cc\]
