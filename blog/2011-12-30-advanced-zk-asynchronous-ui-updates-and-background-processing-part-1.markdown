---
title: Advanced ZK: Asynchronous UI updates and background processing - part 1
date: 2011-12-30T21:42:30+01:00
categories: Java, Web
brushes: Java
tags: ZK
---

## Use cases

Asynchronous UI updates are very useful, because they typically improve the responsiveness, usability and the general feel of user interfaces. I'll be focusing here on the [ZK](http://www.zkoss.org) framework, but generally the same principles apply for desktop UIs too (Swing, SWT).

### Long-running processing

Sometimes you might have a database query, or an external web service call that takes a long time. Typically these jobs are synchronous, so basically there is a specific point in the code where the system will have to wait for a result and will block the thread that runs the code. If you end up running code like that in an UI thread, it will usually block the UI completely.

### Real-time updates

Sometimes you don't know in advance the exact time when something in the UI should be updated. For example, you could have a visual meter that shows the amount of users in an application. When a new user enters the application, the UIs of the current users should be updated as soon as possible to reflect the new user count. You could use a timer-based mechanism to continuously check if the amount of users has changed, but if there's too many simultaneous users, the continuous checking will cause a very heavy load even if there is nothing to actually update in the UIs.

## Basic concepts

Let's first digest the title of this blog post: "Asyncronous UI updates and background processing"

### Background processing

In the _long-running processing_ use case the most obvious way to reduce UI blocking is to move expensive processing from the UI threads to some background threads. It's very important to be able to understand what kind of thread will run the code in different parts of your application. For example, in ZK applications, most code is executed by servlet threads which are basically servlet world equivalents to UI threads. In order to execute code in some background thread, we'll need a thread pool. The easiest way is to use java.util.concurrent.ExecutorService that was introduced in JDK5. We can push Runnable objects to the ExecutorService, so we are basically asking the ExecutorService to run a specific block of code in some background thread.

It is absolutely crucial to understand that frameworks that use ThreadLocals will have problems with this approach because the ThreadLocals that are set in the servlet thread will not be visible in the background thread. An example is Spring Security which by default uses a ThreadLocal to store the security context (= user identity + other things).

### Asynchronous UI updates

What does an asynchronous UI update mean in this context? Basically the idea is that once we have some information that we'd like to present in the UI, we'll inform the UI of the new data (= asynchronous) instead of directly updating the UI in the background thread (= synchronous). We cannot know in advance when the new information is available, so we cannot ask for the information from the client side (unless we use polling which is expensive).

## Server push in ZK

With ZK we have basically two different approaches we can use to update the UI once a background thread has new information. The name "server push" comes from the fact that the server has some new data that has to be pushed to the client instead of the typical workflow (client asks the server for information). Firstly, you can do synchronous updates by grabbing exclusive access to a desktop by using Executions.activate/deactivate. Personally I discourage this because once you have exclusive access, UI threads will have to wait until you deactivate the desktop. That's why I won't cover this method at all in this blog post.

On the other hand, asynchronous updates are done by using Executions.schedule, which conforms to the Event/EventListener model of normal event processing. The idea is that we can push normal ZK Event objects to EventListeners, and the client side will be informed of these events. After that ZK does a normal AJAX request using Javascript and the Events will be processed by the EventListeners. This means that if we use asynchronous updates, all actual event processing will be done by servlet threads and all ThreadLocals are available as usual. This makes the programming model very simple, because you need to only have normal event listener methods without complex concurrent programming.

Here's a small example:

<pre class="brush: java">
public class TestComposer extends GenericForwardComposer {
  private Textbox search;

  public void onClick$startButton() {
    if (desktop.isServerPushEnabled()) {
      desktop.enableServerPush(true);
    }

    final String searchString = search.getValue();
    final EventListener el = this; // All GenericForwardComposers are also EventListeners

    // Don't do this in a real-world application. Use thread pools instead.
    Thread backgroundThread = new Thread() {
       public void run() {
         // In this part of code the ThreadLocals ARE NOT available
         // You must NOT touch any ZK related things (e.g. components, desktops)
         // If you need some information from ZK, you need to get them before this code
         // For example here I've read searchString from a textbox, so I can use the searchString variable without problems
         String result = ... // Retrieve the result from somewhere
         Executions.schedule(desktop, el, new Event("onNewData", null, result));
       }
    };

    backgroundThread.start();
  }
  public void onNewData(Event event) {
    // In this part of code the ThreadLocals ARE available
    String result = (String) event.getData();
    // Do something with result. You can touch any ZK stuff freely, just like when a normal event is posted.
  }
}
</pre>

In part 2 I show you how to use JDK5 ExecutorServices to run tasks without manually creating threads. If you truly want to understand ZK server push, you should also read the [relevant ZK documentation](http://books.zkoss.org/wiki/ZK%20Developer%27s%20Reference/Server%20Push).
