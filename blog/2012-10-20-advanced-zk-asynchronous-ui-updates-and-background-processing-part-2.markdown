---
title: "Advanced ZK: Asynchronous UI updates and background processing – part 2"
date: 2012-10-20T23:02:56+02:00
categories: Java, Web
tags: ZK, Java
---

## Introduction

In part 1 I showed how server push and threads can be used to execute background tasks in a ZK application. However, the simple example had a major flaw that makes it a bad approach for real-world applications: it starts a new thread for each background task.

JDK5 introduced the ExecutorService class, which abstracts away the threading details, and gives us a nice interface which can be used to submit tasks for background processing.

In this blog post I will describe the most important parts of creating a ZK app, which contains a background task that takes a string, and returns it in uppercase. The complete sample project is available at Github:

[https://github.com/Gekkio/blog/tree/master/2012/10/async-zk-part-2](https://github.com/Gekkio/blog/tree/master/2012/10/async-zk-part-2)

## 1. Create an ExecutorService instance

First we need an ExecutorService that we can use in our ZK code. In most cases we want a shared singleton instance, which could be configured and managed by dependency injection (e.g. Spring). It is very important to make sure that the ExecutorService is created only once, and it's shut down properly with the application.

In this sample project I will use a simple holder class, which manages the lifecycle of a single statically available ExecutorService instance. This holder _must be configured as a listener_ in zk.xml.

```java
package sample;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.zkoss.zk.ui.WebApp;
import org.zkoss.zk.ui.util.WebAppCleanup;
import org.zkoss.zk.ui.util.WebAppInit;

public class SampleExecutorHolder implements WebAppInit, WebAppCleanup {

    private static volatile ExecutorService executor;

    public static ExecutorService getExecutor() {
        return executor;
    }

    @Override
    public void cleanup(WebApp wapp) throws Exception {
        if (executor != null) {
            executor.shutdown();
            System.out.println("ExecutorService shut down");
        }
    }

    @Override
    public void init(WebApp wapp) throws Exception {
        executor = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
        System.out.println("Initialized an ExecutorService");
    }

}
```

Note that the thread pool is configured using a fixed size based on processors in the system. Proper thread pool sizing is very important, and depends on the type of tasks you intend to execute. The maximum number of threads is also the maximum amount of simultaneous concurrent tasks!

## 2. Write event classes that model the results of the background task

We'll use ZK server push to communicate the task results back to the UI, so the results must be modeled as ZK events. It's always a good idea to create custom subclasses of Event instead of adding the results in the data parameter, because a custom class is more typesafe and can supports multiple fields.

The first event class represents a status update that is sent while the task is still running. In this example it will contain the amount of characters in the input string.

```java
package sample;

import org.zkoss.zk.ui.event.Event;

public class FirstStepEvent extends Event {

    public final int amountOfCharacters;

    public FirstStepEvent(int amountOfCharacters) {
        super("onFirstStepCompleted", null);
        this.amountOfCharacters = amountOfCharacters;
    }

}```

The second event class represents the fully completed task. In this example it contains the input string in upper case.

```java
package sample;

import org.zkoss.zk.ui.event.Event;

public class SecondStepEvent extends Event {

    public final String upperCaseResult;

    public SecondStepEvent(String upperCaseResult) {
        super("onSecondStepCompleted", null);
        this.upperCaseResult = upperCaseResult;
    }

}```

## 3. Write the task class

The task class should have the following characteristics:

*   It implements Runnable
*   It takes all required input data as constructor arguments (the data should be immutable if possible!). This input data must be thread-safe, and generally should not include any ZK-related stuff (no components, sessions, etc.). For example, if you want to use a Textbox value as input, read the value in advance and _don't pass the Textbox itself as an argument_.
*   It takes a Desktop, and at least one EventListener as constructor arguments. They are needed for sending the results back to the UI

In this example the only input data is a string that will be used to compute the task results.

```java
package sample;

import java.util.Locale;

import org.zkoss.zk.ui.Desktop;
import org.zkoss.zk.ui.DesktopUnavailableException;
import org.zkoss.zk.ui.Executions;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.EventListener;

public class SampleTask implements Runnable {

    private final String input;
    private final Desktop desktop;
    private final EventListener<Event> eventListener;

    @SuppressWarnings({ "rawtypes", "unchecked" })
    public SampleTask(String input, Desktop desktop, EventListener eventListener) {
        this.input = input;
        this.desktop = desktop;
        this.eventListener = eventListener;
    }

    @Override
    public void run() {
        try {
            // Step 1
            Thread.sleep(10000);
            Executions.schedule(desktop, eventListener, new FirstStepEvent(input.length()));

            // Step 2
            Thread.sleep(10000);
            Executions.schedule(desktop, eventListener, new SecondStepEvent(input.toUpperCase(Locale.ENGLISH)));
        } catch (DesktopUnavailableException e) {
            System.err.println("Desktop is no longer available: " + desktop);
        } catch (InterruptedException e) {
        }
    }

}
```

Note how all the constructor arguments are stored in private final fields, and how the input data is immutable (Strings are immutable in Java!). The task simulates long-running processing by using Thread.sleep, and submits a status event when the "processing" is half done.

## 4. Schedule tasks in ZK composers

Using the task in composers is very simple. You only need to enable server push, and submit a new task instance to the executor. This automatically starts the task once a free background thread is available.

```java
desktop.enableServerPush(true);
// Get the executor from somewhere
executor = SampleExecutorHolder.getExecutor();
executor.execute(new SampleTask(input.getValue(), desktop, this));
```

In this sample the composer extends GenericForwardComposer, which implements EventListener, so it can itself handle the resulting task events. Both events are handled by methods that update the UI with status information.

```java
public void onFirstStepCompleted(FirstStepEvent event) {
    status.setValue("Task running: " + event.amountOfCharacters + " characters in input");
}

public void onSecondStepCompleted(SecondStepEvent event) {
    status.setValue("Task finished: " + event.upperCaseResult);
}
```

## Final words

It's quite easy to add robust support for long-running tasks in a ZK application by using this technique. The resulting code in ZK composers is very simple, because the results are passed using the typical Event/EventListener paradigm that is very common within ZK apps.

The biggest dangers in this technique are thread-safety bugs, which can be very difficult to debug. It is absolutely crucial to fully understand the threads where every piece of code is executed, and ensure that all shared state is fully thread-safe. Using immutable input data, and immutable output events is usually enough to ensure safety as long as the background task itself doesn't access other non-thread-safe resources. Some common mistakes are:

*   Invoking thread-local dependent library methods in the background task (e.g. any method that seems to magically get the "current" value of some type). The background threads will not automatically contain the same thread-local values as servlet threads, so by default all these kind of methods will fail. For example Sessions.getCurrent(), Executions.getCurrent() in ZK, many Spring Security static methods.
*   Passing non-thread-safe parameters to the background task. For example, passing a mutable List that might be modified by the composer while the task is running (always make copies of mutable collections!).
*   Passing non-thread-safe result data in events. For example, passing a List in a result event, while the List will be modified later on in the task (always make copies of mutable collections!).
*   Accessing non-thread-safe methods in the desktop. Even though you have access to the desktop in the background task, most desktop methods are not thread-safe. For example, calling desktop.isAlive() is not guaranteed to return the status correctly (at least in ZK 6.5 the method relies on non-volatile fields, so writes are not guaranteed to be visible in the background thread)
