---
title: "Citrix SDWAN - DHCP Bug - Fixed"
date: "2018-05-22"
categories: 
  - "citrix"
---

In the latest build of SDWAN there is currently a big relating to the configuration editor UI. When setting up a site, make sure you hit the Audit button before placing any config.

When delivering DHCP on a client SDWAN appliance if these below steps are not followed the DHCP server will not start but will look configured in the UI.

I have worked with Citrix to locate this bug and the details for working around the issue are below.

This error is found in [10.0.1](tel:+441001). If a new site is created and the DHCP server is configured before “Audit Now” is clicked.

A fix that addresses is targetted for the [10.0.2](tel:+441002) version.

You can work around this issue by clicking "Audit Now" before configuring the DHCP server.

**Update 30.11.18:**

This issue is now resolved:

[https://docs.citrix.com/en-us/netscaler-sd-wan/10/release-notes/10-0-2-release-notes.html](https://docs.citrix.com/en-us/netscaler-sd-wan/10/release-notes/10-0-2-release-notes.html)

Issue ID 709403: In NetScaler SD-WAN release 10.0 version 1, the DHCP server cannot allocate IP address in the configured subnet, if a new site is created and the DHCP server is configured before the Audit Now button is clicked.
