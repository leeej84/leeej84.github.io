---
title: "Control Microsoft Teams MSIX Startup Launch with the Windows Registry"
date: "2024-09-15"
tags: AppX MSIX Microsoft Windows
---

![startupimage](images/carstartupimage.png)

You're probably in a position where you are moving to Windows 11 or a later operating system, maybe using Teams v2 and you're wondering how to wrangle these new package formats into submission in the same way you've been doing for years. Specifically I'm referring to the ability to control if an application starts up on user login or not; this can be critical for a VDI admin to control what starts up when a user logs in, especially if its a published application.

Microsoft now have a couple of different application formats, namely AppX and MSIX. These two formats are fundamentally different from MSI's and EXE's. If you've moved up to the new team client, this is now published as an MSIX package, controlling the auto-run of this application on startup is no longer managed by the traditional methods that you're used to. 

 - Run keys in the registry
 - The startup folder in the start menu
 - A scheduled task

MSIX applications can be packaged with an option to allow a startup on login action, not all applications have this, but the new teams does. There is a new way of managing the startup of teams. There is a new registry location:

HKCU\Software\Classes\Local Settings\Software\Microsoft\Windows\CurrentVersion\AppModel\SystemAppData\MSTeams_8wekyb3d8bbwe

A new key is created under this location TeamsTfwStartupTask with the value of State either equalling 1 or 2.
- 1 = Disabled (will not run on user logon)
- 2 = Enabled (will run on user logon)

I found this by using procmon, I'm sharing the process just incase you need to do this with other applications.

Fire up procmon and start a capture. Open the new system settings dialog and navigate to the "Apps" section.

![image1](images/teamsstartup-0000.png)

Filter down on teams.

![image2](images/teamsstartup-0008.png)

Select "Advanced options" on the teams app, using the 3 little dots.

![image3](images/teamsstartup-0007.png)

You are then presented with the details of the app, scroll down until you see "Runs at log-in"

![image4](images/teamsstartup-0006.png)

Toggle the "Runs at log-in" option a few times to generate some events in procmon.

Head back over to procmon and stop the capture. Find "SystemSettings.exe" in the process list. Right click this process and add it as a filter.

![image5](images/teamsstartup-0003.png)

That will narrow down the options for you to filter through. Now select the "filter" option.

![image6](images/teamsstartup-0002.png)

Add a new filter for the Path column contains "Team"

![image7](images/teamsstartup-0001.png)

This will filter down to just a few options.

![image7](images/teamsstartup-0009.png)

You can see here that the registry value being populated is the one I referenced above.

You can take this registry value and set this with whatever management system you use to control the launch behaviour of teams v2.

