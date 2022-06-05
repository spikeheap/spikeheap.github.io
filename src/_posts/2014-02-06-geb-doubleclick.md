---
tags: 
  - engineering
  - guide
title: "Testing double-click events using Geb"
date: 2014-02-06 22:48:00+00:00
comments: true
published: true
description: Testing basic interaction with Geb is easy, but the 'intuitive' way of doing double-clicks fails silently and without any real indication as to why. Fortunately there's a simple solution!
---
Testing basic interaction with Geb is easy, but the 'intuitive' way of doing double-clicks fails silently and without any real indication as to why. Fortunately there's a simple solution!

My first approach was to use <code>dblClick()</code> in place of <code>click()</code>. The result was a test which compiled and ran, but failed to generate the double click event:

```groovy
import geb.spock.GebReportingSpec

class failingSpec extends GebReportingSpec {
    def "double clicking highlights the second div"(){
        def elementIwant = $('div', text: 'Double-clickable div')
        
        when: "I click an element"
        elementIwant.click() // Works
        
        then: "a div has the activated class applied to it"
        $('div', text: 'single-clicked').hasClass("activated")
        
        when: "I double-click an element"
        elementIwant.dblClick() // Does nothing
        
        then: "a different div has the activated class applied to it"
        $('div', text: 'double-clicked').hasClass("activated") // assertion fails
        
    }
}
```

It turns out that double-clicking is a "complex interaction", and because it isn't used that much on webpages it's not part of the core functionality of NonEmptyNavigator.

Fortunately building complex interactions is trivial in Geb, so my updated Spock test only needs one line replacing:

```groovy
import geb.spock.GebReportingSpec

class passingSpec extends GebReportingSpec {
    def "double clicking highlights the second div"(){
        def elementIwant = $('div', text: 'Double-clickable div')
        
        when: "I click an element"
        elementIwant.click() // Works
        
        then: "a div has the activated class applied to it"
        $('div', text: 'single-clicked').hasClass("activated")
        
        when: "I double-click an element"
        interact { doubleClick(elementIwant) }
        
        then: "a different div has the activated class applied to it"
        $('div', text: 'double-clicked').hasClass("activated") // assertion passes
        
    }
}
```

Great, on to the next test!

### Update (7/2/2014)

Here's another example, this time using interactions to do a context-click (right-click to you an me!):

```groovy
// place in src/test/groovy/
import geb.Browser

import geb.*
import org.openqa.selenium.firefox.FirefoxDriver
import geb.spock.GebSpec

class contextClickerSpec extends GebSpec{

  def "Context click opens menu"(){
     
    setup:
    go "http://medialize.github.io/jQuery-contextMenu/demo.html"
    def contextBox = $(".context-menu-one")
    contextBox.text() == "right click me"
  
    when: "I context-click the div"
    interact{ contextClick(contextBox) }
    def editOption = $('li.context-menu-item:nth-child(1) > span:nth-child(1)')
    
    then: "It displays the edit option"
    editOption.displayed
    editOption.text() == "Edit"
    
    cleanup:
    quit()
  }
}
```

If you want to run the test, the following gradle script will sort you out:

```groovy
apply plugin: 'groovy'

repositories{
  mavenCentral()
}

dependencies{
  compile 'org.codehaus.groovy:groovy-all:2.2.1'
  compile "org.gebish:geb-core:0.9.2", "org.gebish:geb-spock:0.9.2", "org.seleniumhq.selenium:selenium-firefox-driver:2.39.0", "org.seleniumhq.selenium:selenium-support:2.39.0"
  testCompile "org.spockframework:spock-core:0.7-groovy-2.0"
}

task runScript (dependsOn: 'classes', type: JavaExec) {
  main = 'contextClicker'
  classpath = sourceSets.main.runtimeClasspath
}
```
