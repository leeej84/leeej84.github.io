---
title: "Publish Teams using MSIX Application Packages with Citrix Virtual Apps and Desktops"
date: "2024-05-10"
tags: citrix msix
---

![citrixmsixteams](images/citrix-msix-teams.png)

You might have heard about a little known application packaging format called MSIX, this is the latest format for application delivery that supports isolation and virtualisation; the last incarnation was App-V and that was around for a number of years.

In my experience, organisations are sturggling with the process of adopting MSIX as the primary method for delivering applications for several different reasons.

- Knowledge of MSIX and what it means
- Time in repackaging applications
- Lack of vendor support for MSIX

If you are getting started with MSIX application deployment then you need to review this article in full, the link below which includes a good introduction to all topics and then at the end, the troubleshooting tips useful when MSIX packages are not playing nicely.

<a href="https://learn.microsoft.com/en-us/windows/msix/desktop/managing-your-msix-deployment-troubleshooting" target="_blank">Managing Your MSIX Deployment and Troubleshooting</a>

### Citrix and MSIX

Citrix has long been a very popular application and desktop delivery technology, a lot of organisations are using Citrix to provide access securely to internal applications securely. Citrix has supported publishing App-V packages for a long time, MSIX was added relatively recently which enabled MSIX package to be published applications. With the latest release of CVAD 2402, MSIX applications can now be deployed to users utilising Citrix published desktops also.

When a user logs into the published desktop, the MSIX applications are installed and registered for the users. Citrix supports both MSIX and MSIX App-Attach also, these two formats can be stored on a network share that is visible to the virtual machines with the Virtual Delivery Agent installed (VDA).

I've provided a quick demo video so you can see what this looks like from an administrative standpoint and also an end-use point-of-view during the logon process.

<iframe width="560" height="315" src="https://www.youtube.com/embed/_nYOF-4rMHk?si=KnUSyXEL1XNvWJ8N" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### Administrative Tasks

In order to fully publish an MSIX application the steps are as follows:
- Add the MSIX package to the network share
- Access Citrix Web Studio (If you are unsure what Web Studio is, <a href="https://www.citrix.com/blogs/2023/04/24/citrix-web-studio-for-on-prem/" target="_blank"><b>check it out</b></a>)
- Browse to App Packages
- Add a Network Share
- Scan the Network Share
- Assign the discovered application to a Delivery Group
- Apply visibility settings to the application

![image1](images/citrixmsix-0000.png)
Open Web Studio, select "App Packages" on the left-hand navigation menu.

![image2](images/citrixmsix-0005.png)
Select the "Sources" tab, Add a new source.

![image3](images/citrixmsix-0004.png)
Add the name of the location, select a delivery group to assign it to, Select "Network Share", populate the UNC path of the share, select MSIX or your appropriate package type and select "Add Source"

The network location will automatically be scanned and any packages be assigned to the delivery group selected.

By default the applications are assigned to all users, you can limit visibility to specific users if required.

![image4](images/citrixmsix-0003.png)
Select "Applications" from the left-hand side navigation menu.

![image5](images/citrixmsix-0002.png)
Right-Click the application and select "Properties".

![image6](images/citrixmsix-0001.png)
Select "Limit Visibility" on the left-hand side of the application properties window.

Select the "Limit Visibility" option and then "Add" to add a user group or selected users only.

### Teams 2.0 and Citrix
The new Microsoft Teams application is now delivered as an MSIX package, this means that you must be running a supported version of Windows in order to be able to deliver Teams to users.

Currently supported Operation Systems can be found here:

<a href="https://learn.microsoft.com/en-us/windows/msix/supported-platforms" target="_blank">MSIX Features and Support Platforms</a>

<b>Note: Windows Server 2016 is not supported, this is due to the fact that there is no MSIX support within this version Windows and Microsoft have not supplied an alternatve package format for installation. I did try running Teams 2.0 using MSIX Core but this unfortunately does not seem to work. What it did highlight is that I need to learn more about the MSIX format.</b>

Using the method I detail in this article, you're able to publish teams directly into users Desktops. Bear in mind that you still require any prerequisites, this includes the WebView2 runtime.

For instructions on manually installing Teams you can find details here:

<a href="https://learn.microsoft.com/en-us/microsoftteams/new-teams-vdi-requirements-deploy" target="_blank">Deploying Teams 2.0 on VDI</a>

You might be wondering why I looked at this method? Well.. I installed teams as per MS instructions on Server 2022 and had no issues, I did the same on Server 2019 and it simply did not work. I was really please to see Citrix providing an option for their customers that enables and instant solution for delivery.

In that vein there is more good news! Citrix is ahead of the curve with regards to their Profile Management solution supporting Teams 2.0 and also the Teams 2.1 optimisation technology that will be released soon. See more information about all of this here:

<a href="https://support.citrix.com/article/CTX585013/microsoft-teams-21-supported-for-vdidaas" target="_blank">Teams 2.1 Support for VDI and DaaS</a>

### Sizing and Performance
Being a techie, I now want to understand how this sort of solution for delivering MSIX Apps scales. We're using a network location in order to store these packages, these are attached when a user logs in; my assumption here would be, if the fileshare is struggling to handle requests the application will launch more slowly or the logon will be slowed.

I'll be performing some testing on scalability figures for this feature and trying to produce some IOPs sizing calculations. Keep your eyes peeled for this and thanks for reading.




