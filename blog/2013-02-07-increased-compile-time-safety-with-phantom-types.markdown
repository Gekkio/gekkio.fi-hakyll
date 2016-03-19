---
title: Increased compile-time safety with phantom types
date: 2013-02-07T21:22:07+01:00
categories: Java
tags: Java
---

## Introduction

Using phantom types is a very simple technique that can be used to increase the compile-time safety of code. There are a lot of potential use cases with different levels of complexity, but even a very lightweight usage of phantom types can significantly increase the compile-time safety.

A phantom type is simply a parameterized type with an unused type parameter. For example:

```java
public class MyPhantomType<T> {
  public String sayHello() {
     return "hello";
  }
  // other methods/fields that never refer to T
}
```

This example class has a type parameter T, but it is never actually used in the code. At first glance this doesn't seem to be very useful, but that's not true! All object instances of phantom types carry the type information, so this technique can be used to "tag" values with some extra information that can be compile-time checked. We can of course escape the typing at any time by writing code without the generics, but that should be avoided at all costs. Some languages, such as Scala completely disallow dropping type parameters, so with Scala you would always have to keep the type information completely.

## Example use case and implementation

One of the simplest and most useful use cases for phantom types is database ids. If we have a typical three-layer (data, service, web) Java web application, we can gain a lot of compile-time safety by replacing the use of raw ids with phantom types everywhere except at the "endpoints" of the architecture. So, the data layer will put raw ids to database queries, and the web layer might get raw ids from external sources (e.g. HTTP parameters), but otherwise we are always dealing with phantom types. In this example I assume that the database id type is always 64-bit long number. First we'll need marker interface that will be implemented by all "entity classes", which should be supported by the phantom type id mechanism:

```java
public interface Entity {
  Long getId();
}
```

The only purpose of this marker interface is to restrict our phantom typed id to a certain set of tagged classes, and provide the getId method that will be used in the implementation. The actual phantom type is an immutable container for a single id value. The type parameter represents the "target type" of the id, which makes it possible to differentiate between id values of different entities in a compile-time safe way. I like to call this class Ref (shorthand for Reference), but this is just a personal choice.

```java
@Value
@RequiredArgsConstructor(AccessLevel.PRIVATE)
public final class Ref<T extends Entity> implements Serializable {
  public final long id;  

  public static <T extends Entity> Ref<T> of(T value) {
    return new Ref<T>(value.getId());
  }
  public static <T extends Entity> Ref<T> of(long id, Class<T> clazz) {
    return new Ref<T>(id);
  }

  @Override
  public String toString() {
    return String.valueOf(id);
  }

}
```

This example class uses the @Value and @RequiredArgsConstructor annotations from Project Lombok. If you don't use Lombok, add the constructor, getter, equals, and hashCode implementations manually (or look for the complete implementation below). Note how the type parameter T is never used anywhere. This also means that you cannot at runtime know the type of the Ref, but that is not usually necessary.

## Using the example implementation

Now, we'll replace the use of raw ids with Refs whenever possible. For example, we could have a service-level method that add a user to a group:

```java
void addUserToGroup(long userId, long groupId);
// without parameter names
void addUserToGroup(long, long);

// VS

void addUserToGroup(Ref<User> userRef, Ref<Group> groupRef);
// without parameter names
void addUserToGroup(Ref<User>, Ref<Group>);
```

Now, when we want to call this method, we'll always need Ref objects instead of raw long values. In this example there are two ways to get Ref values.

1.  If you have an instance of the actual object, call Ref.of(object). This is the most common method in layers other than web
2.  If you have a raw id, and you know the target type, call Ref.of(id, TargetType.class). This is usually required in the web layer if the raw id comes from an external source

In order to extract the raw id value from the Ref, you can read the field or use the getter. This is typically only needed right before database query construction.

## Closing thoughts

In order to understand the benefits of Refs, try to think about the following cases:

*   What happens if you change the order of parameters in a method call which takes ids of different types? (for example our addUserToGroup)
*   What happens if you change the type of the database id (e.g. Integer -> Long, or Long -> UUID)?
*   How likely will you get runtime errors, if you often have method parameters of the same type as the id, but they are not ids? For example, if you have Integer ids and you mix ids and some sort of list indexes in the same method

In all of these cases, the use of Refs guarantees that you get a compile-time error in places where the code is not correct. In a typical codebase this is a huge win with very little effort. Compile-time safety decreases the cost and difficulty of refactoring, which makes maintaining the codebase much, much easier and safer.

Database ids are just a simple example of phantom types. Other typical use cases include some sort of state machines (e.g. Order\<InProcess\>, Order\<Completed\> vs just Order objects), and some kind of unit information for values (e.g. LongNumber\<Weight\>, LongNumber\<Temperature\> vs just longs).

## Ref\<T\> implementation (without Lombok)

```java
public final class Ref<T extends Entity> implements Serializable {
  public final long id;

  public static <T extends Entity> Ref<T> of(T value) {
    return new Ref<T>(value.getId());
  }
  public static <T extends Entity> Ref<T> of(long id, Class<T> clazz) {
    return new Ref<T>(id);
  }

  @Override
  public String toString() {
    return String.valueOf(id);
  }

  private Ref(long id) {
    this.id = id;
  }

  public long getId() {
    return this.id;
  }

  @Override
  public int hashCode() {
    return (int) (id ^ (id >>> 32));
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || o.getClass() != this.getClass())
      return false;
    Ref<?> other = (Ref<?>) o;
    return other.id == this.id;
  }
}
```
