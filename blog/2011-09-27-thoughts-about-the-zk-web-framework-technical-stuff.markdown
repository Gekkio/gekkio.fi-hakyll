---
title: Thoughts about the ZK Web Framework: Technical stuff
date: 2011-09-27T09:12:19+02:00
categories: Java, Web
tags: ZK
---

As I mentioned in my previous post, ZK has a tendency to "just work". The overall technical quality is impressive and on par with most Java web frameworks, but I believe there are some parts of ZK that are less impressive.

## Stuck on Java 1.4

ZK is built with Java 1.4, which greatly limits the flexibility of their API and internal code quality

### Negative effects on ZK internal code

*   ThreadLocals not removed with remove() _(calling set(null) does prevent leaking the contained object but does not properly remove a ThreadLocal)!_
*   Lots of custom synchronization code where simple java.util.concurrent data structures or objects would work (ConcurrentHashMap, Semaphore, Atomic*, etc)
*   StringBuffer is used where StringBuilder would be appropriate

### No annotations

Personally I'm not a fan of annotation-heavy frameworks because annotations are an extralinquistic feature and usually you end up annotations with string-based values that have no type safety. However, I know that some people would be overjoyed to have an API based on them.

### No enums

There are many places in the ZK API where proper enums would be much better than the hacks that are used at the moment. The worst offender is Messagebox. Just look at this signature:

```java
public static int show(String message,
                       String title,
                       int buttons,
                       java.lang.String icon,
                       int focus)
```

Ugh..the magic integers remind me of SWT (which is a great library with an awful API). Let's imagine an alternative version with enums and generics:

```java
public static Messagebox.Button show(String message,
                       String title,
                       Set<Messagebox.Button> buttons,
                       Messagebox.Icon icon,
                       Messagebox.Button focus)
```

Much, much better and more typesafe. No more bitwise OR magic. I could code this in 10 minutes into ZK if it would use Java 1.5.

### No generics

This is the worst part of being stuck on Java 1.4.

I'll just list some of the places where I'd like to see generics:

#### Collection values in API signatures

Example in org.zkoss.zk.ui.util.Initiator:

```java
void doInit(Page page, Map args);
```

vs

```java
void doInit(Page page, Map<String, Object> args);
```

Example in org.zkoss.zk.ui.Component:

```java
List getChildren();
```

vs

```java
List<Component> getChildren();
```

#### Collection-like classes

Example in ListModel:

```java
public interface ListModel {
  ...
  Object getElementAt(int index);
  ...
}
```

vs

```java
public interface ListModel<T> {
  ...
  T getElementAt(int index);
  ...
}
```

All ListModel* classes should also be generic (most extend java.util.Collection).

#### org.zkoss.zk.ui.event.EventListener

```java
public interface EventListener {
  public void onEvent(Event event);
}
```

vs

```java
public interface EventListener<T extends Event> {
  public void onEvent(T event);
}
```

#### org.zkoss.zk.ui.util.GenericAutowireComposer

```java
public class GenericAutowireComposer {
  protected Component self;
  ...
}
```

vs

```java
public class GenericAutowireComposer<T extends Component> {
  protected T self;
  ...
}
```

#### All *Renderer classes

Example in org.zkoss.zul.RowRenderer:

```java
public interface RowRenderer {
  void render(Row row, Object data);
}
```

vs

```java
public interface RowRenderer<T> {
  void render(Row row, T data);
}
```

## Unimpressive server push implementations

The default PollingServerPush has latency and will absolutely kill your application server if there are many active users. CometServerPush is better, but it does not use non-blocking IO and will block servlet threads in your servlet container. Let's put this into perspective:

Tomcat 7.0 default configuration sets connector max threads to 200. This means that if you have 200 comet-enabled desktops, Tomcat will stop responding to other requests because all the threads are in use by comet. If the implementation used Servlet 3.0 or container-specific async APIs instead, you could run Tomcat even with one thread. It would of course be slow but it would not stop working!

Also, CometServerPush requires ZK EE so regular users are stuck with PollingServerPush. I'd say that's a pretty big limitation considering how server push is marketed. However, it's not surprising: proper non-blocking comet is hard to implement and requires non-blocking components in all parts of the pathway from the browser to the servlet code.

## Zscript

I don't like zscript. It might have been a good feature many years ago, but I believe that today it should not be used at all. Why, oh why would someone want to replace typesafe compiled Java code with non-typechecked zscript mixed with ZUL templates?

*   "I can use Python/Ruby/...". This might be a valid point for some people but you'll end up with unmaintainable code mangled inside ZUL templates
*   "Changes are visible when you save the file". True, but I would never sacrifice so much just for this feature. And besides, you can get a similar effect with [JRebel](http://www.zeroturnaround.com/jrebel).

So, if you put "Java code" (=BeanShell code) in zscript, you might want to rethink that.

## Reliance on reflection

Many useful features rely on reflection, which limits what things the compiler can check for you. This is very typical thing in many Java libraries/frameworks, so it's not really a ZK-specific thing. As a Scala user I can see how the limitations of Java have guided most frameworks to the path of reflection/annotations. Reflection cannot always be avoided but I think it's a bad sign if most of the useful features rely on reflection. Here are some features in ZK that use reflection:

*   Any kind of event listening that does not use component.addEventListener. This includes any classes that extend GenericEventListener (such as all ZK-provided Composer classes except MultiComposer)
*   Data binding
*   EL expressions in ZUL templates
