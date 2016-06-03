---
title: "Thoughts about the ZK Web Framework: Overall experience"
date: 2011-09-08T20:25:29+02:00
categories: Java, Web
tags: ZK
---

I've been asked several times to present some of my opinions about [ZK](http://www.zkoss.org/). So, based of my experience of 4 years as a ZK user, here's some thoughts:

## Overall developer experience, the community and documentation

### "It just works"

Most of the stuff that ZK offers works very well, and the functionality is usually very intuitive to use if you have developed any desktop Java applications before. In 2007 I did a comparison of RIA technologies that included Echo2, ZK, GWT, OpenLaszlo and Flex. Echo2 and OpenLaszlo felt incomplete and buggy and didn't seem to have proper Maven artifacts anywhere. GWT seemed more of a technical experiment than a good platform to build on. Flex was dropped because some important Maven artifacts were missing and Flash was an unrealistic requirement for the application. On the other hand, ZK felt the most "natural" and I was able to quickly get productive with it. During my 4 year long journey with ZK, I've gotten plenty of those "wow" moments when I've learned more and more of ZK and improved my architectural understanding of the framework.

Nowadays I've got a pretty good understanding of what in ZK works, what doesn't, and what has problems and what doesn't. But still, after gaining all this good and bad insight, I consider ZK to be a very impressive product out of the box. The downside of this is of course the fact that the framework hides a lot of things from newcomers in order to be easy to use, and _some of these things will bite you later on,_ especially if your application has lots of users.

### It's very, very, very flexible

ZK is very flexible and has plenty of integrations. Do you want use declarative markup to build component trees? Use ZUL files. Do you want to stick to plain Java? Use richlets. You can also integrate JSP, JSF, Spring, and use plenty of languages in zscript. The core framework is also pretty flexible and you can override a lot of stuff if you run into problems.

The downside is that there are very many ways of doing things correctly, and even more ways of screwing up. Flexibility itself is not a negative point, but I think that the ZK documentation doesn't guide users enough towards the best practices of ZK. What are the best practices anyway? Many tutorials use zscript, but the docs also recommend to avoid it due to performance reasons.

### The forum is quite active

I think that the ZK forum is one of the best places to learn about ZK. It's pretty active and the threads vary from beginner level to deep technical stuff. I read the forums myself almost every day and sometimes help people with their problems. There's one thing that troubles me a bit: the English language in the forums isn't usually very good and people often ask too broad questions. I know, it's not fair to criticize the writings of non-native English speakers, especially when I'm not a native speaker myself. Regardless, I think that such a barrier exists. For example, take 5 random threads from the ZK forum and Spring Web forum. The threads in the Spring forums are typically more detailed and focused instead of _"I'm a newbie and I need to create application x with tons of features, please tell me how to do everything"_-type threads you see in the ZK forums and people clearly spend some time formulating good and detailed questions. You'll see that you have to spend a bit more time in the ZK forum in order to understand the threads. It's not anybody's fault or anything, nor a bad thing, this is just an observation. Unfortunately for me it means that some of my limited time I have for the ZK community is spent just trying to understand what people are saying. Usually I answer a thread only when I know the answer right away, or if the thread concerns some deep technical stuff.

### There's plenty of documentation

In the past the ZK documentation was scattered, out of date and some of the more important stuff was completely missing. In the recent years the docs have improved a lot, and there's now separate comprehensive references for [ZK configuration](http://books.zkoss.org/wiki/ZK_Configuration_Reference), [client-side ZK](http://books.zkoss.org/wiki/ZK_Client-side_Reference), and [styling](http://books.zkoss.org/wiki/ZK_Style_Guide). I think the documentation is today very good, and most basic questions can be easily answered by reading the docs.
