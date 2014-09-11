---
title: SBT and JRebel
date: 2010-01-21T17:34:08+01:00
categories: Scala
brushes: scala
tags: JRebel, SBT, Scala
---

I was at first sceptical about [JRebel](http://www.zeroturnaround.com/jrebel/), but after using it for a while, I must say that it's awesome!

It's compatible with SBT, so you can get a good boost to your productivity when you combine JRebel with the incremental compilation of Scala code in SBT.

However, when using JRebel, you don't want Jetty to redeploy the webapp automatically. You could just disable Jetty manually but then people who don't use JRebel would have to reload manually.

Here's how to disable Jetty redeploying in SBT only if JRebel is active:

<pre class="brush: scala">
class YourProject(info: ProjectInfo) extends DefaultWebProject(info) {
  lazy val jrebelInUse = List("jrebel.lic", "javarebel.lic").exists(this.getClass.getClassLoader.getResource(_) != null)

  override def scanDirectories = if (jrebelInUse) Nil else super.scanDirectories
}
</pre>

**Update:** Consider using [sbt-jrebel-plugin](http://github.com/Gekkio/sbt-jrebel-plugin) instead because it can also generate _rebel.xml_ files for you!
