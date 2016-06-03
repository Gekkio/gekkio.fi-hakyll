---
title: "In defense of Scala: Understanding the ++ operator"
date: 2011-11-29T12:13:07+01:00
categories: Scala
tags: Scala
---

Many people, including [Stephen Colebourne](http://blog.joda.org/2011/11/scala-feels-like-ejb-2-and-other.html), have complained about some of the methods in the Scala collections API. A common example is the ++ operator:

```scala
// There are many variants but this is what Stephen Colebourne used as an example
def ++ [B >: A, That] (that: TraversableOnce[B])(implicit bf: CanBuildFrom[List[A], B, That]) : That
```

Here's an example of its use:

```scala
val first = List(1, 2, 3)
val second = List(4, 5, 6)
println(first ++ second)
// List(1, 2, 3, 4, 5, 6)
```

In this blog post I'll try to show that the perceived complexity of the definition is a necessary thing arising from several design goals. I'll try to show code examples in Java so that the overall syntax is familiar for most people. Basically I'm trying to say that by following the following three goals you end up with the same kind of definition that Scala has (except that it cannot be represented with Java without violating any of the goals). If you feel that your grasp of Java generics is lacking or just want the TLDR version, you can [skip right away to the monstrosity](#final).

## Design goals

### 1. Immutability

*   The collection classes should be immutable.

### 2. Type safety

*   The API should be as type safe as possible (explicit instanceofs or casts should not be needed)

### 3. Conformity with OOP

*   Common methods should also be abstracted to interfaces if possible
*   The collection classes should work with element subtypes/supertypes correctly

## Common code

First we have a naive ImmutableList implementation that just wraps a standard Java list:

```java
// ImmutableList.java
public class ImmutableList<A> {
  private final List<A> inner;

  private ImmutableList(List<A> inner) {
    this.inner = inner;
  }

  public static ImmutableList<A> of(A value1, A value2) {
    List<A> inner = new ArrayList<A>();
    inner.add(value1);
    inner.add(value2);
    return new ImmutableList<A>(inner);
  }
}
```

We'll also use some data types to demonstrate design goal 3:

```java
public interface Animal {
  String getSound();
}

public class Cat implements Animal {
  public String getSound() {
    return "meow";
  }
}

public class Dog implements Animal {
  public String getSound() {
    return "woof";
  }
}
```

## Attempt 1

```java
// ImmutableList.java
public ImmutableList<A> concat(ImmutableList<A> other) {
  List<A> newInner = new ArrayList<A>();
  newInner.addAll(this.inner);
  newInner.addAll(other.inner);
  return new ImmutableList<A>(newInner);
}
```

Well that was easy, right?

Nope, the implementation doesn't support variances (return element type can be super type of T, argument element type can be sub type of T).

```java
ImmutableList<Cat> cats = ImmutableList.of(new Cat(), new Cat());
ImmutableList<Dog> dogs = ImmutableList.of(new Dog(), new Dog());
ImmutableList<Animal> animals = cats.concat(dogs); // Will NOT compile
```

## Attempt 2

As far as I know, it's not possible to make the above code compile with Java unless you drop generics (= violate goal 2). It's possible to play with wildcards if you make it a static method instead:

```java
// ImmutableList.java
public static <S> ImmutableList<S> concat(ImmutableList<? extends S> first, ImmutableList<? extends S> second) {
  List<S> newInner = new ArrayList<S>();
  newInner.addAll(first.inner);   
  newInner.addAll(second.inner);  
  return new ImmutableList<S>(newInner);
}
```

But a static method is a completely different beast, so let's just ignore this problem for a moment and forget the support for variances. We are violating goal 3, but let's just go on.

## Attempt 3

Now let's imagine we extend our immutable collection library with another type: ImmutableSet. We want to be able to concat sets too, so we create a concat method (still violating goal 3 regarding variances):

```java
// ImmutableSet.java
public ImmutableSet<A> concat(ImmutableSet<A> other);
```

Now, based on goal 3 we must abstract this concat method to an interface called ImmutableCollection:

```java
// ImmutableCollection.java
public interface ImmutableCollection<A> {
  ImmutableCollection<A> concat(ImmutableCollection<A> other);
}
```

Looks good, right?

Nope, the concat method now returns a generic collection, and the actual type is lost. It's very reasonable to expect this to work:

```java
ImmutableList<Dog> dogs = ImmutableList.of(new Dog(), new Dog());
ImmutableList<Dog> moreDogs = ImmutableList.of(new Dog(), new Dog());
ImmutableList<Dog> fourDogs = dogs.concat(moreDogs); // Won't compile because concat returns ImmutableCollection
```

The point here is that _the returned object is an ImmutableList_, but at compile time we cannot abstract the method in ImmutableCollection AND preserve the return type. We can of course cast the return value but we'll violate goal 3.

## Attempt 4

We need a way to describe the implementation type in the interface:

```java
// ImmutableCollection.java
<THAT extends ImmutableCollection<A>> THAT concat(ImmutableCollection<A> other);
// ImmutableList.java
public <THAT extends ImmutableCollection<A>> THAT concat(ImmutableCollection<A> other) {
  // ...
  return new ImmutableList<A>(newInner); // Won't compile!!
}
```

Now the interface compiles and the dog example works, but the implementation of concat will not compile anymore. The problem is that the implementation of concat must support all ImmutableCollections while the implementation is providing only a subtype (= ImmutableList).

## Attempt 5

We must somehow abstract away the construction of the new collection:

```java
// ImmutableBuilder.java
public interface ImmutableBuilder<THAT> {
  THAT build(Collection elements);
}
```

I've violated goal 2 and dropped generics from elements in advance because I know they won't work. An ImmutableBuilder is just a factory that knows how to create objects of type THAT from a collection of elements. Now we'll change the signatures of both the interface and the implementation:

```java
// ImmutableCollection.java
<THAT> THAT concat(ImmutableCollection<A> other, ImmutableBuilder<THAT> builder);

// ImmutableList.java
public <THAT> THAT concat(ImmutableCollection<A> other, ImmutableBuilder<THAT> builder) {
  List<A> inner = // ...
  return builder.build(inner);
}
```

Everything compiles now, so now we only need an implementation of a builder:

```java
// ImmutableList.java
public static <T> ImmutableBuilder<ImmutableList<T>> builder() {
  return new ImmutableBuilder<ImmutableList<T>>() {
    public ImmutableList<T> build(Collection elements) {
      return new ImmutableList<T>(new ArrayList<T>(elements));
    }
  };
}
```

## Overview of the final Java version

We now have everything in place for our immutable collection API. On our journey we have violated goals 2 and 3 (due to language limitations) and added complexity to our implementation. However, the complexity cannot be avoided without violating the design goals. Our API is also pretty clunky to use:

```java
ImmutableBuilder<ImmutableList<Dog>> listBuilder = ImmutableList.builder();

ImmutableList<Dog> dogs = ImmutableList.of(new Dog(), new Dog());
ImmutableList<Dog> moreDogs = ImmutableList.of(new Dog(), new Dog());
ImmutableList<Dog> fourDogs = dogs.concat(moreDogs, listBuilder);
```

We don't support variances and we have to pass around a builder for most of the operations. Due to goal 1, most interesting operations on the collections will return new ones, and thus will need a builder instance!

Stephen Colebourne wrote about ++ in his blog post:

> "In fact this is the equivalent to Java's addAll() on a list"

Reading this made me completely lose my respect to the guy. **This is absolutely wrong and misses completely the crucial difference**: immutability (= goal 1). Java's addAll() doesn't return a new collection, so it does not need ImmutableBuilder and variances cause less problems because there is no return type. However, Java collections are generally not immutable and thus violate goal 1. **It is a completely different thing if you want mutable collections, but then you would have completely different requirements and you are not talking about Scala's ++ operator anymore.** If you want OOP-compatible, immutable, type-safe collections, you will end up with something that Scala has. That is why I consider complexity arising from goal 1 to be _necessary_. It's also worth nothing that you don't always have to understand the exact details of a method signature, and in the collections API the CanBuildFrom stuff is pretty much same everywhere.

## Comparison with the Scala version

Java:

```java
<THAT> THAT concat(ImmutableCollection<A> other, ImmutableBuilder<THAT> builder);
```

Scala:

```scala
def ++ [B >: A, That] (that: TraversableOnce[B])(implicit bf: CanBuildFrom[List[A], B, That]) : That
```

First thing you should note is that they are not actually equivalent. The Scala version does not violate any goal, but the Java version violates goals 2 and 3. Let's look at all the type parameters we have here:

<dl>
<dt>A</dt>
<dd>Element type of the first collection</dd>
<dt>That/THAT</dt>
<dd>The type that we expect to get out of the operation</dd>
<dt>B</dt>
<dd>Element type of the second collection. The definition essentially says that type B can be a supertype of A.</dd>
</dl>

The next thing you should note is CanBuildFrom in the Scala version. CanBuildFrom[List[A], B, That] is a factory object that can create objects with type That, element type B from Lists of element type A. Sounds complex, but it's not that difficult to understand. Our Java version is simpler (no A/B type parameters), but it violates our design goals. The presence of parameters B and That in the Scala version makes my previous dog/cat example possible and if you run that with Scala you will get a list of animals.

The CanBuildFrom parameter in the Scala version is implicit, meaning that it will automatically be added by the compiler to invocations based on the import scoping if possible. So 99% of the time you will not need to actually handle the parameter yourself. In the Java version you have to include the builder parameter all the time. I really have trouble understanding the fear of implicits. Many things that would be implicits in good Scala code are typically pushed to static variables or ThreadLocals in Java (this is of course not the case with the collections API).

## About the syntax

Finally I must also mention that many people complain the use of operators instead of named methods. Personally I have no problem with this as long at it is not overused. The ++ operator is probably based on Haskell where list concat is done with that operator.

I'd also like to ask why don't the complainers complain about other operators? The trivial answer is of course that most operators like +, - are based on mathematics and as such are "common knowledge". But what about operators like modulo (% in some languages, mod in others)? What about the power operator (^, ^^ or **)? I don't see many Python programmers crying about \*\* even though the syntax is not based on mathematics directly.

On the other hand, good syntax is always a matter of taste. I like the fact that for example scalaz has both named and operator versions of most important methods.
