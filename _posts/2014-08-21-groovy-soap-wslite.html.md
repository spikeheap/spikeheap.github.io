---
layout: post
tags: ['post', 'software', 'development']
title: "Groovy SOAP clients with ws-lite"
comments: true
published: true
---

When we needed to quickly build a proof-of-concept to test a set of SOAP services I thought: "this is perfect for Groovy, and it's DSL support will mean talking to SOAP won't require stub generation or any of that pain". I was almost right.  

**TLDR;** My client script is [available as a GitHub gist](https://gist.github.com/spikeheap/b5428f11834a0cea3822) for cannibalisation.

<!-- more -->

SOAP is *almost* legacy, but it's still the only way to interface with large enterprise systems, at least in healthcare. Just as I've come to accept that CSV is **the** way everyone sends lab and patient records (when they're not exporting to Excel sheets), I wasn't surprised when our project with MirthResults and MirthConnect only had SOAP calls to add patients to a component. No problem, I thought, just Google "Groovy SOAP" and I'll be done in 10 minutes.

So, the top result is [the Groovy SOAP documentation](http://groovy.codehaus.org/Groovy+SOAP), which does say (although not very obviously) that it's deprecated. That's fine, it suggests its replacement, [GroovyWS](http://groovy.codehaus.org/GroovyWS). But that page tells you to 'be careful' because the project is dormant. Not to worry, because it suggests looking at [groovy-wslite](https://github.com/jwagenleitner/groovy-wslite). I'm already feeling like I'm entering the rabbit hole.

Fortunately groovy-wslite is an active project and has commits (at the time of writing) from just over a month ago. The DSL is pretty straightforward so I set about connecting to the target WSDL and then added basic authentication. The documentation for the project is quite sparse, so this post is an attempt to bring together the bits that I needed. 

If you need anything other than 'Basic' HTTP autentication, stop right there. The project doesn't seem to support 'Digest' or 'NTLM' authentication, so you might be better going for [plain Java SOAP](http://stackoverflow.com/questions/15940234/how-to-do-a-soap-web-service-call-from-java-class).

In a simple script, you can just grab the wslite dependency and connect in a couple of lines:

``` groovy
@Grab(group='com.github.groovy-wslite', module='groovy-wslite', version='1.1.0')
 
import groovy.xml.*
import wslite.soap.*
import wslite.http.auth.*
 
def client = new SOAPClient('https://mirthtest.local:11443/ClinicalDocumentWSService/ClinicalDocumentWS?wsdl')
client.authorization = new HTTPBasicAuthorization("username", "password")
```

It's then trivially easy to do a SOAP call:

``` groovy
def response = client.send(
		connectTimeout:5000,
		readTimeout:20000,
		useCaches:false,
		followRedirects:false,
		sslTrustAllCerts:true) {
	envelopeAttributes "xmlns:ejb":"http://ejb.results.mirth.com/"
	body {
		"ejb:getSubjectGroupMemberIds" {
			subjectGroupId( 'MySubjectGroup' )
			subjectGroupStatusId( 'NEW' )
		}
	}
}
```

The response we get back contains a bit of extra information, so it's worth checking the response code before ploughing on:

``` groovy
def returnVal
if(response.httpResponse.statusMessage=="OK") {
	returnVal = response.getSubjectGroupMemberIdsResponse.'return'
}
```

It's worth noting that the response element is the name of the service call suffixed with 'Response'. We can then dump the XML in a readable form to the console if we like:

``` groovy
println XmlUtil.serialize(returnVal) // Obviously use a logger here instead :)
```

We can also interrogate the XML tree in the same way we would a normal object structure:

``` groovy
def memberCount = returnVal.results.list.size()
println "There are ${memberCount} members initially"
```

In the following gist I've abstracted the SOAP call away into its own method and then created a method for each SOAP call to give me a quick and easy interface to demo the SOAP calls from the console. Feel free to fork, copy, adapt to your own needs. 

{% gist spikeheap/b5428f11834a0cea3822 %}

{% gist parkr/931c1c8d465a04042403 %}
