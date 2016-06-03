---
title: "Client-side ZK, Part 1: Integrating simple jQuery plugins"
date: 2011-04-03T12:00:21+02:00
categories: Java, Web
tags: Scala, ZK, JQuery
---

## jQuery + ZK = A perfect match?

So, you're a ZK 5.0 user and you've heard it uses [jQuery](http://www.jquery.com/) instead of [Prototype](http://www.prototypejs.org/) like ZK 3 did. You must be thinking: "Yay! I can easily integrate all my favourite jQuery plugins easily". Well, sorry if I'm ruining all the fun but there are a few things you need to know first. ZK is a RIA framework, so pages created with it have a slightly different life cycle than simple HTML+Ajax pages.

Let's try integrating a plugin then! We'll start with a very simple plugin which doesn't have to be integrated as a ZK component. I chose [jQuery Image Rounder](http://www.steamdev.com/imgr/) because it's a very simple plugin and it was on the "Most Popular Plugins" list.

### Preparations

**I'm assuming you have a working ZK project in your favourite IDE using your favourite build tool. The very basics of doing that are out of the scope of this blog post.**

First we'll download the minified JS file from the plugin website, and put it to classpath so that ZK can find it. ZK supports loading resources from classpath, but you have to place your files to _web_ directory in the classpath. I also recommend to add an application-specific subdirectory for the files. For example if you're a Maven/SBT user, the correct place for the minified JS would be _src/main/resources/web/myapp/jquery.imgr.min.js_.

Because we're integrating an image rounder plugin, we'll of course need an image too! I used [this cool CC-licensed photo of a tiger's eye](http://www.4freephotos.com/Eye_of_a_tiger-limage-cf588d8583db5bc2f8e049d5abb8891b.html). Put it in the same directory as the minified JS.

### ZUL + Scala code

Although ZK applications can be developed entirely in Java, I typically like to use ZUL pages for defining the _component structure_ of applications. ZUL pages can be added directly to the webapp root directory (_src/main/webapp_ in Maven/SBT). Let's add index.zul:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<window title="Client-side ZK Part 1" border="normal" apply="myapp.WindowComposer">
  <script src="~./myapp/jquery.imgr.min.js" />
  <panel title="Not rounded">
    <panelchildren>
      <image src="~./myapp/Eye-of-a-tiger412.jpg" />
    </panelchildren>
  </panel>
  <panel title="Rounded">
    <panelchildren id="rounded">
      <image src="~./myapp/Eye-of-a-tiger412.jpg" sclass="rounded" />
    </panelchildren>
  </panel>
  <button id="button" label="Add another rounded image!" />
  <script>
    jq(function() {
      jq('.rounded').imgr({ radius: '20px' });
    })
  </script>
</window>
```

Notice the use of **jq instead of $**, which is the recommended way of using jQuery with ZK. The **~./** prefix in resource paths means the _web_ directory in classpath.

As you might notice, we're using a composer for the top-level window. For actual code I will be using Scala, but all my code could also be implemented with plain Java. Here's WindowComposer.scala:

```scala
package myapp

import org.zkoss.zk.ui.event._
import org.zkoss.zk.ui.util._
import org.zkoss.zul._

class WindowComposer extends GenericForwardComposer {
  private var rounded: PanelChildren = _

  def onClick$button(event: Event) {
    val image = new Image("~./myapp/Eye-of-a-tiger412.jpg")
    image.setSclass("rounded")
    rounded.appendChild(image)
  }

}
```

The composer simply adds a new image to the rounded panel.

<del>Ok looks like we're done! Wow that was easy.</del> The second image won't be rounded! What went wrong? If you open the page in a browser and check the source code, you'll see that the HTML content is almost empty. All the ZK components are defined in JavaScript! So when the jQuery standard document.ready function runs the image rounding code, the ZK components haven't been rendered yet and nothing happens.

### Making the plugin work with ZK

Luckily ZK provides it's own callback mechanism called **zk.afterMount**. We'll just replace the original script element with this:

```javascript
<script>
  zk.afterMount(function() {
    jq('.rounded').imgr({ radius: '20px' });
  })
</script>
```

Finally it works! However, if you click the button, the new images won't be rounded. This of course happens because the jQuery selector isn't used after the initial page load. In Scala/Java code, we can use **Clients.evalJavascript** to run custom JS. This time we won't need afterMount because the code is executed in the button click listener:

```scala
rounded.appendChild(image)
Clients.evalJavascript("jq('.rounded').imgr({ radius: '20px' })")
```

Now it works! But we're running imgr on all elements with class="rounded" on the page. Maybe we could make a more exact selection and run it only on the new image component. We can use DOM id selection instead of class selection to narrow down the operation:

```scala
rounded.appendChild(image)
Clients.evalJavaScript("jq('#" + image.getUuid + "').imgr({ radius: '20px' })")
```

Notice that **ZK component uuid == DOM id. ZK component ids are not rendered in DOM at all!** So a component with id="something" is not rendered as id="something" in the resulting HTML.

### Success!

Finally everything works as intended. Here's a quick recap of the important things:

*   ZK id != DOM id
*   ZK uuid == DOM id
*   Use zk.afterMount instead of document.ready
*   You can run custom Javascript in Java/Scala code with Clients.evalJavaScript

Up next: **Part 2: From jQuery plugin to a ZK component**
