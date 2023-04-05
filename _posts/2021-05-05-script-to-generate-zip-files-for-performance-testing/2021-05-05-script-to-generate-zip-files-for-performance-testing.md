---
title: "Script to Generate Zip Files for Performance Testing"
date: "2021-05-05"
---

![](images/extract-multiple-zip-files-1024x546.png)

I'm working on a project at the moment where I need to generate some zip files of varying sizes to introduce compression into performance workloads. I've written a script and thought it might be useful to others. I've uploaded it to Github and embedded it here.

This script takes publicly available open license content in the form of an ebook, a bunch of audio files, a bunch of video files and a bunch of images and randomly selected text and a file to create content that is compressed. It generate a zip file with a randomly selected bunch of files.

Dependent on how big you want your zip files to be, just increase the MaxMediaFiles value to be larger. Whatever happens, you will always have a text file present within the zip file.

If you find this script useful of think it could do with a few adjustments please let me know.

Random content bundle is available for download here:  
[https://www.leeejeffries.com/wp-content/uploads/2018/09/Random-Content.zip](https://www.leeejeffries.com/wp-content/uploads/2018/09/Random-Content.zip)

Code:  

{% highlight powershell linenos %}
######## #Random Zip File Content Generator
#Copyright: Free to use, please leave this header intact
#Author: Leee Jeffries #Company: LJC (https://www.leeejeffries.com)
#Script help: Designed to generate random zip file content to be used in performance testing
#Purpose: Generate random zip files to be used to introduce unzip load in performance tests
########

######## 
#Introduction 
#This script has been put together to enable random zip content to be generated from Open Source content # #The text content and subject lines of emails are generated from a public domain ebook #The images, video and audio are all public domain open license and are okay to use #without incurring any copyright infringement # #Script to be run in powershell 2.0 or newer #Amend the content locations and you are good to go #Content files can be downloaded from here: https://www.leeejeffries.com/wp-content/uploads/2018/09/Random-Content.zip 
########

######################### #SET THE BELOW VARIABLES# #########################

#Where to output the zip files 
$zipOutputLocation = "C:\Temp\ZipFiles"

#Temporary zip staging location 
$tempStaging = "C:\Temp\Staging"

#Maximum files in a zip, a larger number will select more files making larger zip files (Audio, Video, Music) 
$maxMediaFiles = 100

#Number of zip files required 
$numberOfZipFiles = 50

######################### #SET THE ABOVE VARIABLES# #########################

#Function to generate a zip file from an array of files 
Function Generate-Zip() { 
    [CmdletBinding()] 
    param ( 
        [string[]]$fileArray, 
        [int[]]$archiveNumber 
    )

    ForEach ($item in $fileArray) { 
        If ($item -ne "none") { 
            Copy-Item -Path $item -Destination $tempStaging -Force 
        } 
    }

    Compress-Archive -Path "$tempStaging\*" -DestinationPath "$zipOutputLocation\$($archiveNumber).zip" -Force
    Return "$zipOutputLocation\$($archiveNumber).zip"
}

#Function to randomly generate a text file from a random array of strings 
Function Text-Content([Array] $stringArray) {
    #Reset the selected text varibale 
    $selectedText = "" 
    #Build the random number of times we will loop and collect words 
    $maximumWords = Get-Random -Minimum 1 -Maximum 1000 
    do { 
        $selectedText = $selectedText + $stringArray[(Get-Random -Maximum ([array]$stringArray).count)] 
        $selectedText = $selectedText + " " $i++ } 
    until ($i -eq $maximumWords) return $selectedText 
}

#Function to clear out the staging folder 
Function Clear-Staging() { 
    Remove-Item -Path "$tempStaging\*.\*" -Force 
}

#Reset tracker $x = 1

#Check if the staging locations exist and if not, create them 
If (!(Test-Path -Path $tempStaging)) {
    New-Item -Path $tempStaging -Type Directory -Force
} 
If (!(Test-Path -Path $zipOutputLocation)) {
    New-Item -Path $zipOutputLocation -Type Directory -Force
}

#Location of Movie file attachments 
$movieLocation = "C:\Users\Leee\Downloads\Random-Content\MOV" 
#Location of MP3 music attachments 
$audioLocation = "C:\\Users\\Leee\\Downloads\\Random-Content\\MP3" 
#Location of JPG picture attachments 
$imageLocation = "C:\\Users\\Leee\\Downloads\\Random-Content\\JPG" 
#Location of Textfile ebook 
$textLocation = "C:\\Users\\Leee\\Downloads\\Random-Content\\ebook.txt"

#Create all arrays of files and an array of words from the ebook 
$movieFiles = @(Get-ChildItem -Path $movieLocation) 
$audioFiles = @(Get-ChildItem -Path $audioLocation) 
$imageFiles = @(Get-ChildItem -Path $imageLocation)

#Get the contents of the eBook and then split the words into an array 
$textFile = Get-Content $textLocation $stringArray = @($textfile.Split(" "))

#Loop through until the required number of zip files is created 
do { 
    $fileArray = "" 
    $fileArray = For ($l=0; $l -le $maxMediaFiles; $l++) { 
        #Select a random random file of each type 
        $selectedMovie = $movieFiles[(Get-Random -Maximum ([array]$movieFiles).count)] 
        $selectedAudio = $audioFiles[(Get-Random -Maximum ([array]$audioFiles).count)] 
        $selectedImage = $imageFiles[(Get-Random -Maximum ([array]$imageFiles).count)]

    #Select a random number 
    $numberSelected = Get-Random -Minimum 1 -Maximum 10

    #Dependent on what number was selected we will get an attachment or nothing at all 
    switch($numberSelected){ 
        1 {$selectedAttachment = $selectedMovie.FullName} 
        2 {$selectedAttachment = "none"} 
        3 {$selectedAttachment = "none"} 
        4 {$selectedAttachment = "none"} 
        5 {$selectedAttachment = "none"} 
        6 {$selectedAttachment = $selectedAudio.FullName} 
        7 {$selectedAttachment = "none"} 
        8 {$selectedAttachment = "none"}
        9 {$selectedAttachment = "none"} 
        10 {$selectedAttachment = $selectedImage.FullName} 
    }

    #If we are at the end of the loop then create the text file that will be stored in the zip 
    if ($l -eq $maxMediaFiles) { 
        #Call the function to generate a textfile 
        Text-Content -stringArray $stringArray | Out-File -FilePath "$tempStaging\\TextFile.txt" 
    } 
    #Output the file path of the item selected so it can be stored in an array for later use when creating the zip  
    $selectedAttachment 
    
    #Generate a zip files using our created file array 
    Generate-Zip -fileArray $fileArray -archiveNumber $x

    #Clear out the staging area for the next run 
    Clear-Staging 
    
    #Increment to track zip creation 
    $x++

} until ($x -eq ($numberOfZipFiles+1)) 
{% endhighlight %}

Github Link:  
[https://github.com/leeej84/Random-Zip-Content-Generator](https://github.com/leeej84/Random-Zip-Content-Generator)
