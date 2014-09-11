---
title: SBTEI vs SbtEclipsify
date: 2011-04-17T15:27:28+02:00
tags: SBT, Scala, Eclipse
---

## Comparing SBTEI and SbtEclipsify

In addition to SBT plugins for Eclipse, there's also an _Eclipse plugin for SBT_ called [SbtEclipsify](http://github.com/musk/SbtEclipsify). It uses a completely different approach and generates Eclipse project files, so it's similar to the _eclipse:eclipse_ task in Maven.

When comparing SBTEI and SbtEclipsify, it's useful to look at [some comparisons](http://docs.codehaus.org/display/MAVENUSER/Eclipse+Integration) between M2Eclipse and eclipse:eclipse, which are the equivalents in the Maven ecosystem. As you can  see from the comparison, eclipse:eclipse provides adequate basic  support, but some advanced things (e.g. workspace dependency resolution)  require a plugin for Eclipse. This is especially useful when you have multi-module projects **and separate library projects** which you share between some of your projects. Let's say you have a project called MyLibrary and MyProject like this:

MyLibrary:

*   **mylibrary-commons**: contains some useful code you intend to share between your projects

MyProject:

*   **myproject-api**: External API for your project
*   **myproject-webapp**: Webapp for your project
*   **myproject-client**: A command line client for your project's REST API

If I want to develop these four projects at the same time, SbtEclipsify will not work! Even if it would support multi-module projects, you would still be unable to develop mylibrary-commons because there would be no project-to-project dependencies. You could of course add these dependencies manually but that defeats the point of integration.

On the SBTEI side I'm aiming for this hypothetical workflow:

1. Import all four projects in Eclipse

2. Enjoy workspace resolution and multi-module support

3. (If you use JRebel, also enjoy live class file change reloading **across these four projects**)

**This almost works already in SBTEI. **It still needs some work, but this is a goal that is possible to achieve!**

## Recap

Personally I belive it's ok to generate the initial Eclipse  project with a tool such as SbtEclipsify, but for keeping the Eclipse  project up to date (e.g. dependencies), a plugin in the Eclipse side is  much, much better. Pushing changes directly to Eclipse project files reminds me of old school database-based integration techniques that are typically very fragile. The SBT plugin simply cannot understand fully the Eclipse world, and also has no knowledge of the used Eclipse version or the plugins installed. Giving the possibility and responsibility of updating the files directly seems like a potentially fragile choice to me. This is why I'm investing some of my time in SBTEI.
