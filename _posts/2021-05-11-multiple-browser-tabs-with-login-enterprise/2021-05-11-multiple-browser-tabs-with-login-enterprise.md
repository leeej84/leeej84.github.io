---
title: "Multiple Browser Tabs with Login Enterprise"
date: "2021-05-11"
categories: 
  - "loginvsi"
---

![](images/Login-Enterprise-Logo-121719-1024x108.png)

These may be coming a little more regularly as I'm just loving this tools scripting engine. The Latest performance testing product from LoginVSI is Login Enterprise. The scripting language for custom workloads can be written in C# as well as using a preconfigured class supplied by LoginVSI. Don't get scared, you have tons of flexibility with the built-in class and it's easy to use.

I needed to create an application that would allow me to open a number of different chrome tabs, a little beyond that; I wanted to introduce some randomness to the websites that would be opened.

Requirements for my workload:

- Launch a browser window
- Open a random number of tabs
- Open a random website from a pre-defined list of sites
- Scroll up and down through the sites at each tab opening

I've actually used LoginVSI's default sites that are available in the predefined content.

All you need to do to use these applications is to import them into your Login Enterprise appliance. I have actually produced 3 different workloads:

- Microsoft Chromium Edge
- Google Chrome
- Internet Explorer

Instead of listing the code directly here I have uploaded these to a Github repository:

[leeej84/Login-Enterprise-Applications: Login Enterprise Applications and Functions (github.com)](https://github.com/leeej84/Login-Enterprise-Applications){:target="_blank"}

If you're using this tool to simulate load, I'm about to finish an IOPS generator for a user with the idea of replicating IOPs at a point in time for a user.
