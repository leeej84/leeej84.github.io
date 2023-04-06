---
title: "Script for Generating Random Email Content for Testing"
date: "2018-09-17"
---

![](images/letters-2794672_1280-1024x256.jpg)

I'm working on a project at the moment where I need to generate alot of email content for a test users mailbox. I've written a script for this and thought it might be useful to others. I've uploaded it to Github and embedded it here.

This script takes publicly available open license content in the form of an ebook, a bunch of audio files, a bunch of video files and a bunch of images and randomly selected text and a file to create email content. It then relays this email content through an SMTP relay using powershells Send-MailMessage command.

I managed to generate a pst file around the 2GB mark for my testing which will then be imported to my test users mailboxes.

If you find this script useful of think it could do with a few adjustments please let me know.

Random content bundle is available for download here: [Random-Content.zip](https://leeejeffries-my.sharepoint.com/:u:/p/leee_jeffries/EZtHB7ripE5Gs1f8o8s4dLEBx7tdGgPqFhVtdLm4Nor-yw?e=dxzroz){:target="_blank"}

Code: #
{% highlight powershell%} 
######## 
#Random Email Content Generator 
#Copyright: Free to use, please leave this header intact #Author: Leee Jeffries 
#Company: LJC (https://www.leeejeffries.com) 
#Script help: Designed to generate random email content to be passed to an SMTP server 
#Purpose: Fill up a mailbox with random content ########

##Introduction 
#This script has been put together to enable random email content to be generated from Open Source content 
#and then to relay that mail through a local SMTP relay. Once this content is generated a PST file can be 
#exported and then imported into a live mailbox account on Office 365 for testing purposes. All content referenced 
#here can be downloaded in a seperate zip file from my blog site. https://leeejeffries-my.sharepoint.com/:u:/p/leee_jeffries/EZtHB7ripE5Gs1f8o8s4dLEBx7tdGgPqFhVtdLm4Nor-yw?e=dxzroz 
#The file paths will need to be changed to reflect the location you extract them to. 
# 
#The text content and subject lines of emails are generated from a public domain ebook 
#The images, video and audio are all public domain open license so should be okay to use 
#without incurring any copyright infringement # #Script to be run in powershell 2.0 or newer 
#Just place in the smtpserver (Assuming unauthenticated) and the To and From address of the sender #Amend the content locations and you are good to go 
#Note: The script is infinite so a CTRL+C will exit it when you require it to stop 
##

#Function to generate random text between 100 and 400 words from an array of strings 
Function Random-Text([Array] $stringArray) { 
    #Reset the selected text varibale 
    $selectedText = "" 
    #Build the random number of times we will loop and collect words 
    $maximumWords = Get-Random -Minimum 100 -Maximum 1000 
    do { 
        $selectedText = $selectedText + $stringArray[(Get-Random -Maximum ([array]$stringArray).count)] 
        $selectedText = $selectedText + " " $i++ 
    } until ($i -eq $maximumWords) 
    return $selectedText 
}

#Function to randomly generate an email subject from a random array of strings 
Function Email-Subject([Array] $stringArray) { 
    #Reset the selected text varibale 
    $selectedText = "" 
    #Build the random number of times we will loop and collect words 
    $maximumWords = Get-Random -Minimum 1 -Maximum 10 do { 
        $selectedText = $selectedText + $stringArray[(Get-Random -Maximum ([array]$stringArray).count)] 
        $selectedText = $selectedText + " " $i++ 
    } until ($i -eq $maximumWords
    return $selectedText 
}

#SMTP Server that will relay the email 
#Review Send-MailMessage docs page for additional options on lines 90 and 93 to relay through a secure mailserver (You will need to add "Get-Credential to grab user credentials") 
$smtpServer = "emailserver.net"

#Location of Movie file attachments 
$movieLocation = "C:\temp\MOV\" 
#Location of MP3 music attachments 
$audioLocation = "C:\temp\MP3\" 
#Location of JPG picture attachments 
$imageLocation = "C:\temp\JPG\" 
#Location of text document that holds words, an ebook in this case 
$textLocation = "C:\temp\ebook.txt"

#Address details 
$toAddress = "person received the email" 
$fromAddress = "person sending the email"

#Create all arrays of files and an array of words from the ebook 
$movieFiles = @(Get-ChildItem -Path $movieLocation) 
$audioFiles = @(Get-ChildItem -Path $audioLocation) 
$imageFiles = @(Get-ChildItem -Path $imageLocation) 
$textFile = Get-Content $textLocation $stringArray = @($textfile.Split(" "))

#Set number of emails sent to track in output 
$tracker = 0

#Loop through infinitly until CTRL+C is pressed 
do { 
    #Select a random amount of words from our ebook and also a random file of each type 
    $selectedText = Random-Text -stringArray $stringArray 
    $selectedMovie = $movieFiles\[(Get-Random -Maximum (\[array\]$movieFiles).count)\] 
    $selectedAudio = $audioFiles\[(Get-Random -Maximum (\[array\]$audioFiles).count)\] 
    $selectedImage = $imageFiles\[(Get-Random -Maximum (\[array\]$imageFiles).count)\]

    #Pick a number between 1 and 10 to see if the there will be a Movie,Music,Image or no attachment selected 
    $numberSelected = Get-Random -Minimum 1 -Maximum 10

    switch($numberSelected){ 
        1 {$selectedAttachment = $selectedMovie.FullName} 
        2 {$selectedAttachment = $selectedAudio.FullName} 
        3 {$selectedAttachment = $selectedImage.FullName} 
        4 {$selectedAttachment = ""} 
        5 {$selectedAttachment = ""} 
        6 {$selectedAttachment = ""} 
        7 {$selectedAttachment = ""} 
        8 {$selectedAttachment = ""} 
        9 {$selectedAttachment = ""} 
        10 {$selectedAttachment = ""} 
    }

    #Call the function to generate a random email Subject 
    $selectedSubject = Email-Subject -stringArray $stringArray

    If ($numberSelected -gt 3) { 
        #Send email without attachment 
        Send-MailMessage -To $toAddress -From $fromAddress -Subject $selectedSubject -Body $selectedText -SmtpServer $smtpServer -Verbose 
    } else { 
        #Send email WITH attachment 
        Send-MailMessage -To $toAddress -From $fromAddress -Subject $selectedSubject -Body $selectedText -SmtpServer $smtpServer -Attachments $selectedAttachment -Verbose $selectedAttachment 
    }

    #Increment email being sent 
    $tracker++

    #Progress of email messages "Email number $tracker - $numberSelected - $selectedSubject - $selectedAttachment"
} until ($x -eq 0)
{% endhighlight %}

Github Link: [https://github.com/leeej84/Random-Email-Content-Generator](https://github.com/leeej84/Random-Email-Content-Generator){:target="_blank"}
