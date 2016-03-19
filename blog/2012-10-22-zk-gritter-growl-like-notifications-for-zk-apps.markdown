---
title: ZK Gritter: Growl-like notifications for ZK apps
date: 2012-10-22T13:08:40+02:00
categories: Java, Web
tags: ZK, Java
---

## Introduction

Jawwa ZK Gritter is an open source library that can be used to add Growl-like notifications to ZK apps. The library provides a simple-to-use server-side Java API that can be used to control notifications in the application. Installation instructions are available in the reference manual.

A sample app that demonstrates all the customization options is available at Github:

[https://github.com/Gekkio/blog/tree/master/2012/10/zk-gritter](https://github.com/Gekkio/blog/tree/master/2012/10/zk-gritter)

## Usage

The library provides a class called Gritter, which contains multiple static methods. Notifications are added using the builder pattern, so you must first obtain a notification builder, build the notification by calling the appropriate methods, and finally complete the builder and show the notification.

```java
Gritter.notification().withTitle("ZK Gritter demo").withText(LOREM_IPSUM).
  show()
```

All notifications require both the title and text parameters, and you must remember to call show or the notification will not be actually shown to the user.

## Customization

The library supports multiple parameters that can be used to customize the appearance and behaviour of the notifications. The API is fully documented with Javadoc.

### Timeout and stickiness

By default all notifications fade out in 6 seconds, but this can be overridden by setting a custom timeout in milliseconds.

```java
Gritter.notification().withTitle("ZK Gritter demo").withText(LOREM_IPSUM).
  withTime(500).show();
```

You can also add sticky notifications that don't fade out at all unless the user closes them or they are removed programmatically.

```java
Gritter.notification().withTitle("ZK Gritter demo").withText(LOREM_IPSUM).
  withSticky(true).show();
```

All visible notifications can be cleared manually. Calling removeAll removes both normal and sticky notifications.

```java
Gritter.removeAll();
```

### Custom CSS

The sclass parameter can be used to set a custom CSS class.

```css
<style>
  .gritter-red .gritter-top {
    background-image: url(gritter-red.png);
  }
  .gritter-red .gritter-item {
    background-image: url(gritter-red.png);
  }
  .gritter-red .gritter-bottom {
    background-image: url(gritter-red.png);
  }
</style>
```

```java
Gritter.notification().withTitle("ZK Gritter demo").withText(LOREM_IPSUM).
  withSclass("gritter-red").show();
```

### Custom image

Notifications can also include an optional 48x48px image.

Java code:

```java
Gritter.notification().withTitle("ZK Gritter demo").withText(LOREM_IPSUM).
  withImage("/warning.png").show();
```
