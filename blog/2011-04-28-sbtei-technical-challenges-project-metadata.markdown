---
title: SBTEI technical challenges: Project metadata
date: 2011-04-28T23:15:41+02:00
tags: SBT, Scala, Eclipse
---

## Overview of the challenge

The biggest challenge in SBTEI is the most fundamental one: project metadata. SBT is very customizable, so many things that are needed for Eclipse integration are customizable:

*   Source folders (src/main/scala, src/test/scala)
*   Managed libraries (lib_managed/*/*.jar)
*   Unmanaged libraries (lib/*.jar)
*   Project-to-project dependencies (multi-module projects)
*   Webapp files (src/main/webapp)
*   Webapp name
*   Extra plugins (e.g. sbt-jrebel-plugin)

All these things might vary on a per-project basis so trusting these defaults will not be sufficient.

## Accessing the metadata

There are generally two ways to gain access to the metadata:

1. Read the metadata with Eclipse from the project definition

This is what M2Eclipse does easily because Maven project definitions are XML files and thus parseable by other things than Maven. With SBT this is not an option because SBT project files are code that has to be run in order to calculate the needed metadata. This leaves us with option two:

2. Write the metadata with SBT in some parseable format

This is the approach what I'm currently using. I wrote a processor for SBT called [sbt-metadata-exporter](http://github.com/Gekkio/sbt-metadata-exporter) that exports some common project metadata into an XML file. While XML is maybe not the optimal format, I chose it because Scala has great support for it without the need of external libraries.

In SBTEI repository there is a branch called **wip-metadata-export**, where I'm developing a version of SBTEI that uses project metadata exported by _sbt-metadata-exporter_. The downside of this version is that the SBT support absolutely requires metadata exporting and vanilla SBT projects are no longer supported!

At the moment I don't intend to continue my work on the master branch, because think metadata access is crucial and there is no point to go on without it. If the metadata approach is considered a necessary evil and the correct way to move forward, the wip-metadata-export branch can then be merged to master.
