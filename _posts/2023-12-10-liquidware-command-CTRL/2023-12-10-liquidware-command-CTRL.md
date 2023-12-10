---
title: "Liquidware CommandCTRL - What is it all about?"
date: "2023-12-10"
tags: liquidware, endusercomputing
---

![liquidwarelogo](images/liquidware-logo.png){:style="display:block; margin-left:auto; margin-right:auto"}

There are many monitoring solutions within the End User Computing space with many vendors competing for a slice of the "monitoring" pie.

Liquidware's CommandCTRL was announced as generally available on August 21, 2023. This release marked the product's transition from a beta phase to full availability for users, signifying its readiness for wider deployment in end-user computing environments

### Licensing

Liquidware offers different licensing options to cater to various needs. One notable option is the CommandCTRL Community Edition, which is a free version designed for limited personal use. This edition provides access to many of the powerful features found in the premium edition but is limited to a 5-machine license. This version is ideal for optimizing a small group of workspaces and includes a 24-hour window of Windows telemetry data retention with the CommandCTRL DVR feature. The Community Edition is particularly suitable for lab use.

For broader organizational needs or more extensive deployment, CommandCTRL offers a standard version available through a SaaS model. This version is ideal for businesses and larger environments requiring real-time metrics, diagnostics, and remediation capabilities across multiple workspaces. The standard edition is available for a 15-day trial, allowing organizations to evaluate the software before making a purchase decision.

### Features
- Real-Time Metrics and Remediation
  - CommandCTRL provides real-time metrics for CPU, memory, disk, and network usage, as well as identity, location and Wi-Fi. This aids in expediting the troubleshooting of end-user experience.
- DVR-like Playback Mode 
  - The DVR-like playback feature captures up to 30 days of history (24 hours for community edition), enabling administrators to review past events and metrics at specific dates and times. This is very useful in the information gathering phase of any troubleshooting.
- Process Identification with ChatGPT Integration
  - The integration with ChatGPT AI assists in identifying processes, helping users quickly understand the purpose and origin of unfamiliar processes consuming system resources.
- Protocol Mirroring 
  - This feature provides the ability to view and compare metrics for the local endpoint and the cloud desktop simultaneously.
- Ease of Deployment and Use
  - Being a SaaS solution, CommandCTRL requires no additional infrastructure, is quick to set up, and can be accessed from anywhere with a browser, making it highly scalable and user-friendly.
- Non-Intrusive Operations
  - CommandCTRL enables actions like terminating rogue processes or managing services directly from the console without interrupting the end user. It also offers capabilities like opening a PowerShell, CMD, or Bash session remotely.
- Advanced Troubleshooting Tools
  - Features like built-in Quick Assist, Remote Assistance, and Teleconferencing options facilitate deeper engagement when necessary, without compromising the user's experience.

There are a few more features to list, these are the stand-out features for me.

### Getting Started
Getting started with CommandCTRL is pretty easy.

#### Sign Up
- Visit <a href="https://cc.liquidware.com/" target="_blank">Liquidware</a> and select "Sign Up"
- Fill in your email and select Register
- You'll receive and email, just follow the prompts from there
- The process is simple and painless

#### Deploy the agent
The CommandCTRL agent can be deployed to any Windows or MAC endpoint. I'm focusing on Windows endpoints because I don't own a MAC.

![liquidware1](images/liquidware1.png){:style="width:100%;height=100%;"}

- Scroll to the "Miscallaneous" section on the left-hand navigation bar
- Select "Install Agent"
- Select "Download Agent"
- Select "copy" on the code snippet section
- Jump into the folder you downloaded the agent to
- Hold shift, right click in some free space, Select "Open in Terminal" (Or similar)
- Paste the command from CommandCTRL

This will install the agent and after around a minute or so, your machine will appear in the portal.

In an enterprise environment you can deploy from a file share very easily by using a scripted approach, amending the command line to point to the CommandCTRL installer on a fileshare.

![liquidware2](images/liquidware2.png){:style="width:100%;height=100%;"}

### Machines
To see your inventory of machines where your agent is deployed, just select "Machines" from the left-hand navigation.

![liquidware3](images/liquidware3.png){:style="width:100%;height=100%;"}

I have a few lab VMs and then my laptop added here. I can click into any of these machines to see an overview of real time statistics.

### Monitoring and Management
![liquidware4](images/liquidware4.png){:style="width:100%;height=100%;"}
![liquidware5](images/liquidware5.png){:style="width:100%;height=100%;"}

You can see, I have a nice overview of all the statistics about my laptop, CPU usage, Memory Usage, Disk Space, Battery Life, Network Bandwidth, GPU utilisation.

The cool piece, I am RDP'ed to DC-01 in my lab, CommandCTRL links the connection, as its also monitoring DC-01 and its able to give me metrics from both sides. This is the "**Protocol Mirroring**" feature I talk about earlier.

Red tiles are deemed "bad" and they are the ones you need to focus on.

![liquidware6](images/liquidware6.png){:style="width:100%;height=100%;"}

Selecting, "Processes" from the left-hand navigation gets you a view of all processes running on the machine. You can also kill processes from here.

![liquidware7](images/liquidware7.png){:style="width:100%;height=100%;"}

Selecting "Services" from the left-hand navigation shows a list of all services on the machine, these can be started and stopped from here.

![liquidware8](images/liquidware8.png){:style="width:100%;height=100%;"}

Selecting "Performance" from the left-hand navigation shows a dashboard for key performance indicators, CPU, Memory, Disk, GPU.

![liquidware9](images/liquidware9.png){:style="width:100%;height=100%;"}

Selecting "Diagnostics" from the left-hand navigation shows several tools for common troubleshooting, Speedtest, Ping, Traceroute, Ipconfig, GPreport and Agent Logging. These items are particularly useful for non-intrusive user troubleshooting.

![liquidware10](images/liquidware10.png){:style="width:100%;height=100%;"}

There are a few more actions for us to be able to interact with the machines being monitoring. You'll see some icons right at the top of the screen. From left to right:

- View History
  - Lets you review the dashboard but in a historical way. You can loop back in time and review what was happening to the machine at an earlier point in time. A small animated image shows the process below.

![liquidware11](images/liquidware11.gif){:style="width:100%;height=100%;"}

- Shell
  - This opens a PowerShell connection so you can run commands and troubleshoot in this way also.
- Diagnostics
  - This was covered earlier, tools like ping and traceroute are available here.  
- Scripts
  - Scripts will allow you to search within a library of pre-configured scripts. This will then be executed locally on the machine.

### Scripts
Scripts are a huge way of managing environments in End User Computing, automation is key to building repeatable, reliable solutions. It comes as no surprise that CommandCTRL has a script library. Upload your own scripts here and then run them locally on your managed machines.

Navigate to "Scripts" in the left-hand navigation menu. You'll be presented with the scripts library section.

![liquidware11](images/liquidware11.png){:style="width:100%;height=100%;"}

You can see here, I've already added a "Get-ComputerInfo" script, uploading is a simple process, attach your ps1 file, fill in details and your done. The sorts of information you need to populate are, description of the scripts, instructions on how to use it, parameters that are required. 

**Note: Your script does need to be signed to work, even with a self-signed certificate is fine. If you need help doing this, you can generate a self-signed cert.**

Follow <a href="https://codesigningstore.com/how-to-create-self-signed-code-signing-certificate-with-powershell" target="_blank">this guide</a> to generate the certificate, install the certificate in your personal store and in "Trusted Root Certificate Authorities". You can then use the Set-AuthenticodeSignature command <a href="https://www.clickssl.net/blog/how-to-sign-a-powershell-script" target="_blank">like this</a> to sign your code before uploading.

Once you have uploaded a script you can run this on a Machine. All the results are stored for script runs, you can always go back to these results and review them.

### Summary
CommandCTRL has some cool features, the ability to have this level of functionality without deploying any infrastructure and only deploying agents is a large benefit. I'm interested to see what features will be in the roadmap for the future.


