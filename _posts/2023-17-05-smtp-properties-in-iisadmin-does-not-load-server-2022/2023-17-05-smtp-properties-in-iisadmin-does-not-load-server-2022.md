---
title: "SMTP Properties will not load on server 2022 in IIS admin mmc snap-in"
date: "2023-15-05"
---

![](images/mmc-error.png)

If you're like me, you like to keep your lab up to date and Server 2022 is on the list for upgrade. I like to be able to relay mail out of my lab for alerting and some scripting.

If you are getting the error, "MMC has detected an error in a snap-in. It is recommended that you shut down and restart MMC." when you edit the properties of the SMTP Service; here is your solution:

* Stop SMTPSVC service [Display Name: Simple Mail Transfer 
* Protocol (SMTP)]
* Stop IISADMIN service [Display name: IIS Admin Service]
* Edit "C:\Windows\System32\inetsrv\MetaBase.xml"
* Find: <IIsSmtpServer Location ="/LM/SmtpSvc/1"
* Add (Settings are alphabetical): RelayIpList=""
* Save file
* Start IISAdmin Service
* Start SMTPSVC service

As long as the settings "RelayIpList" is present in the file you'll be fine.
