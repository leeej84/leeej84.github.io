---
title: "Checking prices for azure VMs with PowerShell"
date: "2023-11-15"
tags: azure, powershell
---

![pricingimage](images/price.png){:style="display:block; margin-left:auto; margin-right:auto"}

If you are trying to add VM pricing into any of your PowerShell scripts or modules, here are a couple of PowerShell functions that will help.

<!--more-->

## PowerShell Functions

Here are two PowerShell functions that can help you get Azure VM pricing information:

### Get-AzureVMPrice Function

```powershell
Function Get-AzureVMPrice {
    [CmdletBinding()]
    Param(
        [Parameter(ValueFromPipeline, HelpMessage='The VM Sku to get prices for', Mandatory=$true)]
        [string]$vmSku,
        [Parameter(HelpMessage='The currency to report back', Mandatory=$true)]
        [string]$currencyCode,
        [Parameter(HelpMessage='Azure region to get prices for', Mandatory=$true)]
        [string]$region
    )

    # Setup parameters
    $Parameters = @{
        currencyCode = $currencyCode
        '$filter' = "serviceName eq 'Virtual Machines' and armSkuName eq `'$vmSku`' and armRegionName eq `'$region`' and type eq 'Consumption'"
    }

    # Make a web request for the prices
    try {
        $request = Invoke-WebRequest -UseBasicParsing -Uri "https://prices.azure.com/api/retail/prices" -Body $Parameters -Method Get
        $result = $request.Content | ConvertFrom-JSON | Select-Object -ExpandProperty Items | Sort-Object effectiveStartDate -Descending | Select -First 1

        $vmPrice = [PSCustomObject]@{
            SKUName = $($result.armSkuName) 
            Region = $($result.armRegionName) 
            Currency = $($result.currencyCode)
            Product_Name = $($result.productName)
            Price_Per_Minute = if ($($result.unitOfMeasure) -match 'Hour') {$($result.retailPrice)/60 } else { 0 }
            Price_Per_Hour = if ($($result.unitOfMeasure) -match 'Hour') { $($result.retailPrice) } else { 0 }
            Price_Per_Day = if ($($result.unitOfMeasure) -match 'Hour') { $($result.retailPrice) * 24 } else { 0 }
        }
        
        if ([string]::IsNullOrEmpty($vmPrice.SKUName)) {
            Throw
        } else {
            Return $vmPrice
        }
    } catch {
        Write-Error "Error processing request, check the SKU and region are valid"
        Write-Error $_
    }
}
```

### Get-AzureVMSKUs Function

```powershell
Function Get-AzureVMSKUs {
    [CmdletBinding()]
    Param(
        [Parameter(HelpMessage='Azure region to get prices for', Mandatory=$true)]
        [string]$region
    )

    # Setup parameters
    $Parameters = @{
        currencyCode = $currencyCode
        '$filter' = "serviceName eq 'Virtual Machines' and  armRegionName eq `'$region`' and type eq 'Consumption'"
    }

    # Make a web request for the prices
    try {
        $request = Invoke-WebRequest -UseBasicParsing -Uri "https://prices.azure.com/api/retail/prices" -Body $Parameters -Method Get
        $result = $request.Content | ConvertFrom-JSON | Select-Object -ExpandProperty Items | Select-Object armSkuName

        $SKUs = foreach ($item in $result) {
            $item.armSkuName
        }

        Return $SKUs | Select-Object -Unique | Sort-Object
    } catch {
        Write-Error "Error processing request, check the region and currency are valid"
        Write-Error $_
    }
}
```

There are two functions here, they can be configured to feed into each other, we'll take a look at that. Add the functions to your existing scripts or run the above script, this will load the Functions into memory. The two functions can be called independently and also chained together.

* **Get-AzureVMSKUs** - Gets a list of all Azure VM SKUs in a region
* **Get-AzureVMPrice** - Gets a price for a given VM SKU

### Example Usage

#### Get All VM SKUs in a Region

```powershell
Get-AzureVMSKUs -region uksouth
```

This will return a list of all available VM SKUs in the UK South region.

#### Get Pricing for a Specific VM

```powershell
Get-AzureVMPrice -vmSku Standard_D2_v2 -region uksouth -currencyCode GBP
```

This will generate pricing information for a Standard_D2_v2 VM running in the UK South region in GBP currency.

#### Interactive Selection with Out-GridView

You can chain these functions together to make it interactive using Out-GridView:

```powershell
Get-AzureVMSKUs -region uksouth | Out-GridView -PassThru | Get-AzureVMPrice -currencyCode GBP -region uksouth
```

This allows you to select a VM SKU from a grid view and automatically get the pricing information.

![pricingimage](images/Azure_OGV_SKU.png){:style="display:block; margin-left:auto; margin-right:auto"}

I hope someone else finds this useful.
