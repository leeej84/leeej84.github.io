---
title: "Detecting Older Citrix Receiver Versions with Citrix ADC EPA – Much more difficult than it sounds!"
date: "2021-03-31"
categories: 
  - "citrix"
---

![](images/033121_2039_DetectingOl1.png)![](images/033121_2039_DetectingOl2.png)

With all the hustle and bustle of getting teams rolled out across the globe on all environments, people struggle to ensure that virtual servers are offloading all that grunt work to the endpoint. Unfortunately, it's just not that simple.

If you are running a Citrix environment and looking for a smooth experience for your users, you'll want to offload the processing of Teams calls and conferences to the local endpoint. Right now, I'm just talking about windows endpoints. The scenario is as follows; users are all logging in with their BYOD devices; these devices have a Citrix Receiver version and NOT the Citrix Workspace App. The user connects to the Shared Compute Desktop, launches teams and starts making calls. The Teams workload is not offloaded to the users laptop/desktop, and the CPU usage on the server goes sky high and kills the performance for everyone else.

What Citrix did implement is a key you can set on your VDA to stop the fallback of teams:

- Machine Wide: HKEY\_LOCAL\_MACHINE\\SOFTWARE\\Microsoft\\Teams\\DisableFallback
- User Specific: HKEY\_CURRENT\_USER\\SOFTWARE\\Microsoft\\Office\\Teams\\DisableFallback
- DWORD – 1 or 2 (1 means disable fallback, 2 means disable audio only)

I have found that unless you have the correct version of the Citrix Workspace App that supports the optimization in the first place, this value doesn't do anything.

A way to enforce Citrix Receiver is updated to a support copy of the Citrix Workspace App to use Citrix ADC Endpoint Analysis. I started down this route.

Firstly, I want to make sure that the Workspace or Receiver version is higher than the last receiver version. Simple right? No. The value I looked for:

- Computer\\HKEY\_LOCAL\_MACHINE\\SOFTWARE\\WOW6432Node\\Citrix\\Dazzle\\Version

I attempted to check for the installed ICA client version; unfortunately, as it's a string value, I cannot do a version more than check-in EPA. For reference, these are the registry values for each version of Citrix Receiver:

- 4.9 - 4.9.0.2528
- 4.9.1000 - 4.9.1000.14
- 4.9.2000 - 4.9.2000.16
- 4.9.3000 - 4.9.3000.9
- 4.9.4000 - 4.9.4000.9
- 4.9.5000 - 4.9.5000.5
- 4.9.6000 - 4.9.6001.1
- 4.9.7000 - 4.9.7000.8
- 4.9.8000 - 4.9.8000.19
- 4.9.9002 - 4.9.9002.4
- 4.11 - 4.11.0.36
- 4.12 - 4.12.0.18013

That rules this out; I spent a while installing different Citrix Receiver and Citrix Workspace App versions and testing the policies. Next, I attempted to scan for a couple of files on the endpoint.

- C:\\Program Files (x86)\\Citrix\\ICA Client\\HdxTeams.exe
- C:\\Program Files (x86)\\Citrix\\ICA Client\\HdxRtcEngine.exe

This worked on endpoints where the user was an admin or UAC was disabled, but on some endpoints, it fails as the EPA agent fails to get into the folder and see the executable.

The final solution, I checked for the existence of the "Citrix Workspace Updater Service", this service was introduced in the Citrix Workspace App 2010 release. This at least confirms a minimum version of Citrix Workspace App 2010. My final EPA Expression for a Pre-authentication Policy:

- CLIENT.SVC(CWAUpdaterService) EXISTS

I hope this saves someone some time. In the interim of me putting this live, some other nifty solutions were published; a shout out to [Dennis Mohrmann](https://twitter.com/mohrpheus78){:target="_blank"} for his script that notifies users of the fact their client-side receiver is out of date. Check it out here: [MS Teams Optimisation Check](https://github.com/Mohrpheus78/Citrix/tree/main/Teams%20Optimization%20check){:target="_blank"}.
