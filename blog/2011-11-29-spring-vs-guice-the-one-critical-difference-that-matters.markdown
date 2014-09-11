---
title: Spring vs Guice: The one critical difference that matters
date: 2011-11-29T08:42:50+01:00
categories: Java
brushes: Java
tags: Spring Framework, Google Guice
---

## Spring objects are recognized based on their names

It doesn't matter whether you use XML or Java config, a Spring scope is roughly like a Map&lt;String, Object&gt; structure. This means that **you cannot have two objects with the same name**. Why is this a bad thing? If you have a large application with lots of @Configuration classes or XML files, it's very easy to accidentally use the same name twice.

The worst part of this is that using the same with several objects, they silently override each other until only one actually remains in the ApplicationContext. These objects can also be of different types and the declaration order is what really determines which object wins. The problem here is that if you want to make reusable modules based on Spring, you will basically be forced to use a prefix in the name or something else to ensure you won't have a name clash.

## Guice objects are recognized based on their classes

A Guice scope is basically like a Map&lt;Class&lt;?&gt;, Object&gt; structure. This means that **you cannot have two objects of the same type** without using extra metadata (e.g. qualifiers). This design choice has different pros and cons, but overall I think it's the saner one. If you create reusable modules, you mostly have to make sure that you don't export any objects of common types (e.g. String). With type-based scopes you can always create a wrapped class for common types, while with name-based scopes you would always have to use unique names based on lucky guesses. Guice also has PrivateModules so you can use Guice for all injection, but only export some of the objects in the scope.

## Example code

Here's a naive example of a Spring application that breaks runtime because of silent bean overriding.

### Main.java

This class instantiates the application context, registers the configuration classes and tries to get a MyBean from the context.

<pre class="brush: java">
package springbreak;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Main {
  public static void main(String[] args) {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();

    ctx.register(GoodConfig.class);
    ctx.register(EvilConfig.class);

    ctx.refresh();
    ctx.start();

    System.out.println(ctx.getBean(MyBean.class).getValue());

    ctx.stop();
  }
}
</pre>

### MyBean.java

This is just an example type of bean that we expect to get from the application context.

<pre class="brush: java">
package springbreak;

public interface MyBean {
  String getValue();
}
</pre>

### GoodConfig.java

This is a configuration class that exports a MyBean

<pre class="brush: java">
package springbreak;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GoodConfig {

  private static class MyBeanImpl implements MyBean {
    public String getValue() {
      return "I'm a bean";
    }
  }

  @Bean
  public MyBean myBean() {
    return new MyBeanImpl();
  }

}
</pre>

### EvilConfig.java

This configuration class exports a String with the name myBean. It's not a very realistic example but shows the basic idea.

<pre class="brush: java">
package springbreak;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EvilConfig {

  @Bean
  public String myBean() {
    return "I'm a string!";
  }

}
</pre>

## Analyzing the example

Can you guess what happens when you run the example? Here's the basic idea:

1.  GoodConfig exports a MyBeanImpl with the name "myBean"
2.  EvilConfig exports a String with the name "myBean" replacing the one from GoodConfig **even though the types won't match**
3.  Main gets a NoSuchBeanDefinitionException "No unique bean of type [springbreak.MyBean] is defined"

So, basically a MyBeanImpl is replaced by a String and there won't be a bean that implements MyBean. The worst part is that _if you reverse the @Configuration class registration order, the code will work_ because then a String will be replaced by a MyBeanImpl. Now, imagine you have 20 nicely encapsulated modules with potentially conflicting names...I've banged my head against the wall several times trying to debug problems in a situation like that.

Spring (as of version 3.0.6) offers no possibility to alter the naming of @Configuration class exported beans. If you want to create safely reusable modules, you will have to use some kind of fully qualified names in the methods that export beans (e.g goodConfigMyBean, evilConfigMyBean).

I like Spring (especially non-DI-container parts), but in new projects I will refuse to use a library that is so fundamentally broken. And yes, using the same name twice is a developer error, but any library that is prone to such errors can be considered worse than an alternative that attempts to minimize them.
