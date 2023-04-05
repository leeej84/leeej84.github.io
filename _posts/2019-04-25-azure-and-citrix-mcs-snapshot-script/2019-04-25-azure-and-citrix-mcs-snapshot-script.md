---
title: "Azure and Citrix MCS Snapshot Script"
date: "2019-04-25"
categories: 
  - "azure"
  - "citrix"
---

Various conversations on twitter have triggered this blogpost.

For those of you working in Azure and using MCS to provision servers, this will come in handy.

So; MCS in azure will give you an option to rollback to your previous image and you can also use snapshots with managed disks; its not always the solution though.

Earlier version of CVAD didn't support managed disks, so in this scenario rollback to anything prior to your last MCS update isn't easy.

I wrote a script a while back to handle this and wanted to share it.

The script will copy the vhd file from your master VM into a different storage container in the same storage account and give it a date and time suffix. Using this format you have full rollback opportunities between any previous versions of the image.

\[cc lang=powershell\]
#Azure Subscription ID
$subID = ""

#Storage Account Name
$storAccount = ""

#Storage Access Key
$accessKey = ""

#Blob Container Name with Source VHD
$storContainer = ""

#Destination Container , Same Storage Account
$destContainer = ""

#Master Image VHD Name
$vhdName = ""

#MCS Disk Name Prefix
$MCSPrefix = ""

#Destination VHD Name
$formattedDate = Get-Date -Format "yyyyMMdd-HHmm"
$destVhdName = ($vhdName -replace $vhdName, "") + $MCSPrefix + $formattedDate + ".vhd"

Login-AzureRmAccount

Select-AzureRmSubscription -SubscriptionId $subID

# VHD blob to copy #
$blobName = $vhdName

# Source Storage Account Information
$sourceStorageAccountName = $storAccount
$sourceKey = $accessKey
$sourceContext = New-AzureStorageContext –StorageAccountName $sourceStorageAccountName -StorageAccountKey $sourceKey
$sourceContainer = $storContainer

# Destination Storage Account Information
$destinationStorageAccountName = $storAccount
$destinationKey = $accessKey
$destinationContext = New-AzureStorageContext –StorageAccountName $destinationStorageAccountName -StorageAccountKey $destinationKey

# Create the destination container
$destinationContainerName = $destContainer
New-AzureStorageContainer -Name $destContainer -Context $destinationContext

# Copy the blob
$blobCopy = Start-AzureStorageBlobCopy -DestContainer $destinationContainerName -DestContext $destinationContext -DestBlob $destVhdName -SrcBlob $vhdName -Context $sourceContext -SrcContainer $sourceContainer

# Retrieve the current status of the copy operation
$status = $blobCopy | Get-AzureStorageBlobCopyState

# Print out status
$status

# Loop until copy complete
While($status.Status -eq "Pending"){
$status = $blobCopy | Get-AzureStorageBlobCopyState
Start-Sleep 10

# Print out status
$status }
\[/cc\]
