---
title: "Server 2016 Licensing – Know your numbers!"
date: "2017-09-10"
categories: 
  - "microsoft"
---

Server 2016 licensing has really mixed things up for clients and unfortunately it can be a bit tricky to understand what the score is with regards to what is needed. I've spent some time with a client this week looking at this topic and I wanted to share what was discovered.

With 2012 licensing you have DataCenter licensing and Standard licensing, DataCenter licensing allows you to license the physical processors in the server and then run an unlimited number of VM's. For people with very beefy processors this was the right choice, in the main it works out cheaper in a highly virtualised environment.

With Standard licensing you needed to license the physical processors each time you wanted to run two copies of the Windows Server OS. This only became a non-viable option in heavily-virtualised environments. This use of multiple Standard licensing is referred to as stacking.

With Server 2016 licensing the model has changed, Microsoft want to be paid for those extra cores you have and licensing is no longer based on licensing the physical processors. The licensing is now Physical Processor Core based.

You buy a Server 2016 Standard License in a pack of up to 16 cores, a single SKU covers you for 16 physical processor cores. The main restriction here – You must have a minimum of a 16 core license per server irrespective of how many processors or cores it has; if you have 2 x Quad Core Processors that's still a 16 Core License. (Hyper threading does not count as a core)

The stacking of Standard licensing means that if you want to run multiple VM's then you need to license those cores again in order to be able to do this. VM instances must be incremented in two's so 2,4,6,8 etc…

Some examples:

Blade enclosure with 6 x blades each with 2 x 4 core processors:

- DataCenter Licensing = 1 x 16 Core License Required (Unlimited VM's)
- Standard Licensing x 2 VM's = 1 x 16 Core License Required
- Standard Licensing x 4 VM's = 2 x 16 Core License Required

**This is where things change up and it's something everyone should be aware of.**

Blade enclosure with 6 x blades each with 2 x 12 core processors:

- DataCenter Licensing = 1 x 16 Core License + 2 x **4 Core License Required** (Unlimited VM's)
- Standard Licensing x 2 VM's = 1 x 16 Core License + 2 x **4 Core License Required**
- Standard Licensing x 4 VM's = 2 x 16 Core License + 4 x **4 Core License Required**

The 4 Core License SKU is something that not a lot of distribution staff seemed to know about. There is a separate SKU for people that need to top-up the licenses to fit further core requirements.

HP have a great tool for calculating the licensing required for Server 2016, well worth a look here:

[http://h17007.www1.hpe.com/us/en/enterprise/servers/licensing/index.aspx](http://h17007.www1.hpe.com/us/en/enterprise/servers/licensing/index.aspx)
