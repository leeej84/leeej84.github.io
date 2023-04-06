---
title: "PowerScale 2.8 Released"
date: "2020-10-04"
---

![](images/053019_2115_CommunityPr1.jpg)

PowerScale 2.8 has just been released. Its a community tool that I maintain to allow people running in hybrid cloud scenarios to power manage machines and keep costs down. Many options within this script makes it both flexible and adaptable to most environments.

I'll be presenting on a Webinar on the 23rd October to go over the tool's usage and it's features.  
[Check out the link and join us.](https://www.mycugc.org/events/event-description?CalendarEventKey=b1cce94a-3bd3-4ba4-a062-3e29ba9920d6&Home=%2fevents%2fcalendar){:target="_blank"}

More information about PowerScale generally can be found below and on the github page.

Changes in this release:

- Holiday dates can now be specified to be treated as outside of hours.
    - Configuration added "holidayDays" - Specify dates in string format separated by a comma.
- Additional tweaks to Dashboard UI - "instanceName" and "dateFormat" added to support a custom page title and header, also the relevant date format for your locale.
- Control whether the script will scale machines outside of hours. "scaleOutsideOfHours" added as a true or false value.
- During business hours machines can be spun up, but if not used turned off again, this can trigger a large drop in machine numbers. To account for this "restrcitiveScaleDown" has been added with an additional value of "restrcitiveScaleDownFactor" that can be tailored to control the amount of machines shut down in a single run. This can be helpful in very fluid environments.
- Machines that have been scaled on will now be added to the number of in-hours machines to stop the script then powering them down prematurely if users do not utilise them straight away. In order to drain these machines, set your out of hours time to be earlier on.

PowerScale enables businesses running Citrix workloads in a public cloud to manage their usage and capacity efficiently. Workload machines can be shut down and started on a scheduled basis and also scaled dynamically.  
The script is self-contained and easy to configure and also produces a static HTML dashboard with historical usage. This dashboard tracks machines, sessions and even performance Metrics across your entire farm.  
  
There was a Webinar last year which went over the configuration and demonstration of the tool and how to configure with myself and Jake Walsh.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ThvEwn1SMFM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

As always, please let me know if you get this installed and then require any help. There is a slack channel right here or issue on GitHub.

Release:  
[https://github.com/leeej84/PowerScale/releases/tag/2.8](https://github.com/leeej84/PowerScale/releases/tag/2.8){:target="_blank"}

Slack:  
[https://worldofeuc.slack.com/messages/CLCSCA8LR](https://worldofeuc.slack.com/messages/CLCSCA8LR){:target="_blank"}
