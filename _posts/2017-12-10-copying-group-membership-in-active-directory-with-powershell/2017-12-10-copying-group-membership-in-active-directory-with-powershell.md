---
title: "Copying Group Membership in Active Directory with Powershell"
date: "2017-12-10"
categories: 
  - "microsoft"
tags: 
  - "active-directory"
  - "powershell"
  - "windows-server"
---

I had a requirement to configure a bunch of user accounts identically with regards to group membership. I wrote a small powershell script so that a single account could be configured and then all group memberships copied from that group account.

Below is the script I used:

\[cc lang=“powershell”\] Import-Module ActiveDirectory $sourceUser = "" $destUser = "" Get-ADUser -Identity $sourceUser -Properties memberof | Select-Object -ExpandProperty memberof | Add-ADGroupMember -Members $destUser -PassThru | Select-Object -Property SamAccountName \[/cc\]
