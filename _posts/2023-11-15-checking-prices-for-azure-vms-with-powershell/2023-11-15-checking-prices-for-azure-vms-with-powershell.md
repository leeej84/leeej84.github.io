---
title: "Checking prices for azure VMs with PowerShell"
date: "2023-11-15"
tags: azure
---

![pricingimage](images/price.png){:style="display:block; margin-left:auto; margin-right:auto"}

If you are trying to add VM pricing into any of your PowerShell scripts or modules, here are a couple of PowerShell functions that will help.

**PowerShell:**

{% highlight powershell linenos %} 
Function Get-AzureVMPrice {
    [CmdletBinding()]

    Param
    (
        [Parameter(ValueFromPipeline,HelpMessage='The VM Sku to get prices for',Mandatory=$true)]
        [string]$vmSku,
        [Parameter(HelpMessage='The currency to report back',Mandatory=$true)]
        [string]$currencyCode,
        [Parameter(HelpMessage='Azure region to get prices for',Mandatory=$true)]
        [string]$region
    )

    #Setup parameters
    $Parameters = @{
        currencyCode = $currencyCode
        '$filter' = "serviceName eq 'Virtual Machines' and armSkuName eq `'$vmSku`' and armRegionName eq `'$region`' and type eq 'Consumption'"
    }

    #Make a web request for the prices
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
        Write-Host "Error processing request, check the SKU and region are valid"
    }
}

Function Get-AzureVMSKUs {
    [CmdletBinding()]

    Param
    (
        [Parameter(HelpMessage='Azure region to get prices for',Mandatory=$true)]
        [string]$region
    )

    #Setup parameters
    $Parameters = @{
        currencyCode = $currencyCode
        '$filter' = "serviceName eq 'Virtual Machines' and  armRegionName eq `'$region`' and type eq 'Consumption'"
    }

    #Make a web request for the prices
    try {
        $request = Invoke-WebRequest -UseBasicParsing -Uri "https://prices.azure.com/api/retail/prices" -Body $Parameters -Method Get
        $result = $request.Content | ConvertFrom-JSON | Select-Object -ExpandProperty Items | Select-Object armSkuName

        $SKUs = foreach ($item in $result) {
            $item.armSkuName
        }

        Return $SKUs | Select-Object -Unique | Sort-Object
    } catch {
        Write-Host "Error processing request, check the region and currency are valid"
    }
}
{% endhighlight %}

There are two functions here, they can be configured to feed into each other, we'll take a look at that. Add the functions to your existing scripts or run the above script, this will load the Functions into memory. The two functions can be called independently and also chained together.

* Get-AzureVMSKUs - Gets a list of all Azure VM SKUs in a region
* Get-AzureVMPrice - Gets a price for a given VM SKU

{% highlight powershell linenos %}
Get-AzureVMSKUs -region uksouth

Basic_A1
Basic_A2
Basic_A3               Basic_A4                                                                                                                                                                            Dasv4_Type1
Dasv4_Type2
DCsv2 Type 1
Ddsv4_Type 1
Eadsv5_Type1
.........
{% endhighlight %}

This gets a list of all VM SKUs in the uksouth region.

{% highlight powershell linenos %}
Get-AzureVMPrice -vmSku Standard_D2_v2 -region uksouth -currencyCode GBP

SKUName          : Standard_D2_v2
Region           : uksouth
Currency         : GBP
Product_Name     : Virtual Machines Dv2 Series
Price_Per_Minute : 0.0002583333333333333333333333
Price_Per_Hour   : 0.0155
Price_Per_Day    : 0.3720
{% endhighlight %}

This will generate pricing information for a Standard_D2_v2 VM running in the UK South region in the currency of GBP.

You can chain these Functions together to make it interactive to select a VM SKU and get a price using Out-GridView.

{% highlight powershell linenos %}
Get-AzureVMSKUs -region uksouth | Out-GridView -PassThru | Get-AzureVMPrice -currencyCode GBP -region uksouth

SKUName          : Basic_A4Region           : uksouthCurrency         : GBP
Product_Name     : Virtual Machines A Series Basic Windows
Price_Per_Minute : 0.00613
Price_Per_Hour   : 0.3678
Price_Per_Day    : 8.8272
{% endhighlight %}

You can see below, I selected the Basic_A4 SKU and above; the pricing information.

![pricingimage](images/Azure_OGV_SKU.png){:style="display:block; margin-left:auto; margin-right:auto"}

I hope someone else finds this useful.
