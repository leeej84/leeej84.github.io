---
title: "Request an SSL Certificate from a Windows CA without Web Enrolment"
date: "2018-11-14"
categories: 
  - "microsoft"
---

![](images/111418_2035_RequestanSS1.png)

I was in a situation with a client where we did not have access directly to the certificate authority and web enrolment was not available. I used this process to request a wildcard certificate that I could use for the duration of my project.

I'm covering here, how to use certreq and certutil to request, generate and accept the certificate from the CA. This is done using a custom .ini file that specifies the certificate requirements. The whole process is very quick and only takes a few moments.

The Internet Information Server (IIS) provide wizards in the administration user interface to request and install SSL certificates. With this blog post I want to explain how to request a SSL server certificate manually. The manual steps are required if the Certification Authority (CA) is not available in the same forest as the IIS Server is a member of. 

**1. Creating an INF file to set the certificate properties**

Use Notepad to modify the following sample INF file according to your needs. Save the file as ssl.inf for example

{% highlight powershell %} 
[Version] 
Signature="$Windows NT$" 
[NewRequest] 
Subject = "CN=SERVER.DOMAIN.COM" ; For a wildcard use "CN=*.DOMAIN.COM" 
; For an empty subject use the following line instead or remove the Subject line entirely 
; Subject = 
Exportable = TRUE ; Private key is not exportable 
KeyLength = 2048 ; Common key sizes: 512, 1024, 2048, 4096, 8192, 16384 
KeySpec = 1 ; AT_KEYEXCHANGE 
KeyUsage = 0xA0 ; Digital Signature, Key Encipherment 
MachineKeySet = True ; The key belongs to the local computer account 
ProviderName = "Microsoft RSA SChannel Cryptographic Provider" 
ProviderType = 12 
SMIME = FALSE 
RequestType = CMC ; At least certreq.exe shipping with Windows Vista/Server 2008 is required to interpret the [Strings] and [Extensions] sections below 
[Strings] 
szOID_SUBJECT_ALT_NAME2 = "2.5.29.17" 
szOID_ENHANCED_KEY_USAGE = "2.5.29.37" 
szOID_PKIX_KP_SERVER_AUTH = "1.3.6.1.5.5.7.3.1" 
szOID_PKIX_KP_CLIENT_AUTH = "1.3.6.1.5.5.7.3.2" 
[Extensions] 
%szOID_SUBJECT_ALT_NAME2% = "{text}dns=computer1.domain.com&dns=computer2.domain.com" 
%szOID_ENHANCED_KEY_USAGE% = "{text}%szOID_PKIX_KP_SERVER_AUTH%,%szOID_PKIX_KP_CLIENT_AUTH%" 
[RequestAttributes] 
CertificateTemplate= WebServer
{% endhighlight %}

**Notes:**

Leave off the Subject= line if you want the subject to be empty.

If you don't need the template to be specified, remove the RequestAttributes section.

The specification of the enhanced key usage OID is not explicitly required since the EKU is defined in the certificate template. The OID in the INF file above is for explanatory purposes.

You can click on "OK" for the template not found UI from certreq if the client has no access to templates.

You can ignore the unreferenced "[Strings]" section dialog when it appears.

Make sure you add the subject name into the SUBJECT_ALT_NAME text line too.

**2. Compiling the INF file into a REQ file**

The following command-line command will generate key material and turn the INF file into a certificate request.

**certreq –new ssl.inf ssl.req**

Once the certificate request was created you can verify the request with the following command:

**certutil ssl.req**

**3. Submitting the REQ file to the CA**

If the CA is reachable via RPC over the network, use the following command to submit the certificate request to the CA:

**certreq –submit ssl.req
**
You will get a selection dialog to select the CA from. If the CA is configured to issue certificates based on the template settings, the CA may issue the certificate immediately.

If RPC traffic is not allowed between the computer where the certificate request was created and the CA, transfer the certificate request to the CA and perform the above command locally at the CA.

If the certificate template name was not specified in the certificate request above, you can specify it as part of the submission command:

**certreq -attrib "CertificateTemplate:webserver" –submit ssl.req**

**4. Installing the certificate in IIS**

Once the certificate was issued and is available as a file on the target computer, use the following command to install it.

**certreq –accept ssl.cer**

The installation actually puts the certificate into the computer's personal store, links it with the key material created in step #1 and builds the certificate property. The certificate property stores information such as the friendly name which is not part of a certificate.

After performing steps 1 to 4 the certificate will show up in the IIS management interface and can be bound to a web site or a SSL listener.

I hope this helps other people needing to generate flexible Windows Certificates with a CA.
