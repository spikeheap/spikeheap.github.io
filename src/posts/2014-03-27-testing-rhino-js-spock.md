---
layout: post
tags: ['post', 'Gradle', 'software', 'development', 'programming', 'Spock', 'TDD', 'BDD', 'Groovy', 'Eclipse']
title: "Testing Rhino JavaScript with Eclipse, Gradle, Groovy and Spock"
date: 2014-03-27 15:58:00+00:00
comments: true
published: true
description: "A colleague was wrangling with JavaScript testing, but with an unusual constraint: the code runs on the Rhino JS engine. After a bit of head-banging, I learned that continuously testing JavaScript written for Rhino needn't be arduous."
---

A colleague was wrangling with JavaScript testing, but with an unusual constraint: the code runs on the [Rhino JS engine](https://developer.mozilla.org/en-US/docs/Rhino). After a bit of head-banging, I learned that continuously testing JavaScript written for Rhino needn't be arduous. 

## Other potential solutions

There are a number of ways of tackling this problem. Initially we attempted to use one of the many existing JavaScript testing libraries, running on Rhino. Jasmine running on Karma was my first choice, but we soon hit issues with `require` not being present. Since giving up on that avenue I've discovered [CommonJS for Rhino](http://www.angrycoding.com/2011/09/mozilla-rhino-commonjs-module-support.html). That solution may be preferable because it allows you to write your tests in JavaScript, but I love Spock's data driven capabilities and the cleanness of spec tests, so I'm not disappointed with our result.

## Configuring Gradle

We need Gradle to download our dependencies and run the tests, so the first thing to do is initialise a Gradle project:

``` bash
gradle init
```

And then edit the `build.gradle` file to look something like the following:

```groovy
apply plugin: 'java'
apply plugin: 'groovy'
apply plugin: 'eclipse'

repositories {
    jcenter()
}

dependencies {
    compile 'org.codehaus.groovy:groovy-all:2.1.5'
    testCompile "org.spockframework:spock-core:0.7-groovy-2.0" 
	
    compile 'org.mozilla:rhino:1.7R4'
    compile fileTree(dir: 'lib', include: '*.jar')
}
```

This will ensure we've got Rhino on our classpath, and can use Spock to write our tests. The last `compile` dependency allows us to include JAR files in a `lib` directory, which can be handy if you use libraries not available through Bintray or Maven.

We'll use the standard Maven source locations, which we need to create manually:

``` bash
mkdir -p src/{main,test}/{groovy,js}
```

We've now got a Gradle project which we can test with `gradle check`, although there's not much to see at the moment.

## Eclipse

There are a couple of plugins we need for Eclipse 

* The [Groovy-Eclipse plugin](http://groovy.codehaus.org/Eclipse+Plugin) (requires the http://dist.springsource.org/release/GRECLIPSE/e4.3/ update site).
* The [Gradle IDE plugin](https://github.com/spring-projects/eclipse-integration-gradle/) (requires the http://dist.springsource.com/release/TOOLS/gradle update site).

Once they're installed run `gradle eclipse` in the terminal to generate the Eclipse settings files, and then import it into Eclipse with `File > Import... > General > Existing Projects into Workspace`.

### Running tests

In the `Run > Run Configurations` configuration, add a JUnit run configuration set to Run all tests in the selected project, package or source folder (selecting the root of tests).

You can now run the tests (even Spock tests) just like normal!

# Testable JavaScript

We'll create a sample JavaScript file to test in `src/main/js/littleFunction.js`, containing the following:

```js
function addTogether(a, b, c){
	return a + b + c;
}
```

That code isn't likely to win any awards, but we can check that it works by writing a specification.

## Writing tests

Create a Groovy class named `LittleFunctionSpec.groovy` in `src/test/groovy/my/package/`, containing the following:

```groovy
package my.package

class LittleFunctionSpec extends Specification{
	Context context
	Scriptable scope
	
	/**
	 * Setup, prior to every spec test
	 */
	void setup(){
		 context = Context.enter()

		// Set version to JavaScript1.2 so that we get object-literal style
		// printing instead of "[object Object]"
		context.setLanguageVersion(Context.VERSION_1_8)

		// Initialize the standard objects (Object, Function, etc.)
		// This must be done before scripts can be executed.
		scope = context.initStandardObjects()
	}
	
	/**
	 * Teardown method, run after each test. This just ensures we've left the Rhino context.
	 */
	void cleanup(){
		Context.exit();
	}
	
	/**
	 * Load a JavaScript file into the Rhino engine. For resources held within the project you will probably want a filename like:
	 * 		"src/main/js/componentX/script.js"
	 * @param fileName The name of the file to be loaded.
	 */
	void loadJSIntoContext(String fileName) {
		File emulatorFile = fileName as File
		context.evaluateString(scope, emulatorFile.text, emulatorFile.name, 1, null)
	}
    ```

This gives us our Rhino environment (context). Note that if you want to use `XML` objects you'll need to use a context version > 1.7. All we need to do now is add a test:

```groovy
// Add into LittleFunctionSpec.groovy
def "check little function adds numbers together"(){
	given: "I have littleFunction.js loaded"
	loadJSIntoContext("src/main/js/littleFunction.js")
	
	when: "I run the addTogether function for 1, 2, and 3"
	String jsExercise = "var result = addTogether(1,2,3);"
	context.evaluateString(scope, jsExercise, "TestScript", 1, null)
	
	then: "The result is 6"
	scope.get("result", scope) == 6
}
```

Hopefully that specification is pretty self-explanatory. For more information [Check out the Spock documentation](http://spock-framework.readthedocs.org/en/latest/).

The example above used a single value, but we probably want to check quite a few. Spock's [Data Driven Testing support](http://spock-framework.readthedocs.org/en/latest/data_driven_testing.html) makes this simple, so we can rewrite the test as:

```groovy
// Add into LittleFunctionSpec.groovy
@Unroll
def "check addTogether behaves for #a, #b, #c"(){
	given: "I have littleFunction.js loaded"
	loadJSIntoContext("src/main/js/littleFunction.js")
	
	when: "I run the addTogether function for 1, 2, and 3"
	String jsExercise = "var result = addTogether("+a+","+b+","+c+");"
	context.evaluateString(scope, jsExercise, "TestScript", 1, null)
	
	then: "The result is #c"
	scope.get("result", scope) == (a + b + c)
	
	where:
	a   | b   | c
	0   | 0   | 0
	9   | 1   | 0
	5   | 0   | 5
	1   | 1   | 1
	0   | 4   | 24
	1231| 0   | 0
	9999| 0   | 4325
	0   | 035 | 230
}
```

## Running tests

Running the tests is as easy as `gradle check`, or pushing the `run` button in Eclipse. Doing the former, your test results will be output into an easy-to-read HTML file as well as JUnit XML.

# Conclusion

Using a few simple steps we've set up a Gradle project to run Spock tests over Rhino JavaScript, with the added bonus of being able to use Eclipse. 

Because we can now run tests with a single command and interpret the result with most tools (either through the Gradle exit code or the JUnit output), adding this to a continuous build system like [Travis](http://travis-ci.org) or [Jenkins](http://jenkins-ci.org/) is simple! 
