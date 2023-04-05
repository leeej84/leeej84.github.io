---
title: "Change UserPrincipalName for a user on Office 365 when synchronising with AD Connect"
date: "2018-01-03"
categories: 
  - "azure"
---

If you are having problems with some of your accounts in Office 365 where you have had to modify the name of an on-premise user but it's not updating the login name of the user once an AD-Sync has completed, you can run this script below to give the user new UPN in Office 365

\[cc lang=“powershell”\]

$currentUPN = $newUPN =

Import-Module Online Connect-MSolService Get-MSolUser -UserPrincipalName $currentUPN Set-MSolUser -UserPrincipalName $currentUPN -NewUserPrincipalName $newUPN Get-MSolUser -UserPrincipalName $newUPN

\[/cc\]

No errors should be seen when running this script if all works okay.
