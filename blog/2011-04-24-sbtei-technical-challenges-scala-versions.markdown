---
title: "SBTEI technical challenges: Scala versions"
date: 2011-04-24T15:37:17+02:00
tags: SBT, Scala, Eclipse
---

Scala is generally not backwards compatible, so matching Scala versions pose a challenge. SBTEI depends on Scala IDE, which in turn depends on a specific version of Scala that is bundled with the plugin. On the other hand, SBT projects themselves define their own Scala version(s). Having matching Scala versions is very important in order to prevent potential compilation/runtime problems. Java users probably frown on this because binary compatibility in Java libraries is typically decent. However, even Java is not safe from binary incompatibilities unless library updates are handled with extra care.

At the moment it seems that Scala versions x.y.z are binary compatible between different z versions, but not compatible between different x or y versions. In SBTEI, a Scala version check is done in order to prevent errors. If the versions defined by SBT and Scala IDE don't match, an error marker is added to the project. This approach is good for end users, but some questions remain: is this version check sufficient and does it work well enough with snapshot builds of Scala IDE? That will remain to be seen.
