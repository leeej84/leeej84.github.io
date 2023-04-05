---
title: "Reinstating Classic Windows Photo Viewer in Server 2016"
date: "2017-10-25"
categories: 
  - "microsoft"
---

Some people really prefer the older style photo viewer from Windows 7/2008R2 and I have had a few requests for this to be re-instated in Windows 10/Server 2016.

I have compromised a guide below which outlines to necessary steps in order to be able to allow Photo Viewer to launch and then to create the relevant file associations and make them stick with all users in the environment.

The first think you will need to do is download the following zip file:

[![](images/102517_1510_Reinstating1.png)](https://www.leeejeffries.com/wp-content/uploads/2017/10/Restore_Windows_Photo_Viewer.zip)

This contains the relevant .reg file to create the file associations for Windows Photo Viewer so that it appears in the list of programs within Windows.

Open your base image and run the .reg file to import the settings into the registry.

![](images/102517_1510_Reinstating2.png)

Now open the control panel within your base image, select "Default Programs", select "Set Your Default Programs".

![](images/102517_1510_Reinstating3.png)

![](images/102517_1510_Reinstating4.png)

Select "Windows Photo Viewer" on the left and then "Choose Defaults for this Program".

![](images/102517_1510_Reinstating5.png)

Select the relevant file extensions and select "Save".

![](images/102517_1510_Reinstating6.png)

Windows Photo Viewer is now the default application for these file extensions. Go ahead and test to make sure your changes all stuck.

Now, if this is an environment where end user machines are non-persistent you will need to re-present these file associations for users. To do this you can import some default file associations using Group Policy.

This is achieved by using DISM to export file associations and then getting them imported again for the user using Group Policy.

Open PowerShell and run the following command to export a file association document. Save this somewhere that can be referenced by users.

_Dism /Online /Export-DefaultAppAssociations:\\\\Server\\Share\\DefAppAssoc.xml_

The Group Policy Entry you are looking to set to allow the document to be imported is as follows:

- Computer Configuration > Administrative Templates > Windows Components > File Explorer

![](images/102517_1510_Reinstating7.png)

![](images/102517_1510_Reinstating8.png)

Now all users will have a default file association set for Windows Photo Viewer.

Happy Photo Viewing!
