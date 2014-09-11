---
title: JPA entity scanning with Spring
date: 2010-07-01T20:17:02+02:00
categories: Java
brushes: Scala, Xml
tags: Java, Java Persistence API, Spring Framework
---

If you've used JPA, does this look familiar?

<pre class="brush: xml">
&lt;persistence&gt;
  &lt;persistence-unit&gt;
    &lt;class&gt;my.entities.package.Entity&lt;/class&gt;
    &lt;class&gt;my.entities.package.Another&lt;/class&gt;
    &lt;class&gt;my.entities.package.More&lt;/class&gt;
    &lt;class&gt;my.entities.package.EvenMore&lt;/class&gt;
    &lt;class&gt;my.entities.package.AndMore&lt;/class&gt;
    &lt;class&gt;my.entities.package.AndEvenMore&lt;/class&gt;
  &lt;/persistence-unit&gt;
&lt;/persistence&gt;
</pre>

Writing JPA entity class names into persistence.xml can be a pain. How could a <span class="line-through">lazy</span> wise programmer make it easier?

By implementing entity scanning of course!

JPA has its own class scanning system, but it has some fundamental limitations.

As far as I know, it only scans the JAR where persistence.xml resides so it cannot be used to include other entities into the same persistence context. Spring supports [PersistenceUnitPostProcessor](http://static.springsource.org/spring/docs/3.0.x/javadoc-api/org/springframework/orm/jpa/persistenceunit/PersistenceUnitPostProcessor.html)s that can modify a persistence context and add new entities into it!

A post processor could for example scan a base package for entities and add all entities which have proper JPA annotations.

Here's a post processor written in Scala:

<pre class="brush: scala">
import javax.persistence.{Entity, Embeddable, MappedSuperclass}

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.config.BeanDefinition
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider
import org.springframework.core.`type`.filter.AnnotationTypeFilter
import org.springframework.orm.jpa.persistenceunit.{MutablePersistenceUnitInfo, PersistenceUnitPostProcessor}
import scala.collection.JavaConversions._

class EntityScanningPersistenceUnitPostProcessor(basePackage: String)
    extends ClassPathScanningCandidateComponentProvider(false)
    with PersistenceUnitPostProcessor {

  addIncludeFilter(new AnnotationTypeFilter(classOf[Entity]))
  addIncludeFilter(new AnnotationTypeFilter(classOf[Embeddable]))
  addIncludeFilter(new AnnotationTypeFilter(classOf[MappedSuperclass]))

  private val log = LoggerFactory.getLogger(this.getClass)

  override def postProcessPersistenceUnitInfo(info: MutablePersistenceUnitInfo) {
    val count =
      findCandidateComponents(basePackage).foldLeft(0L) { (count, beanDefinition) =&gt;
        info.addManagedClassName(beanDefinition.getBeanClassName)
        count + 1
      }
    log.info("Registered {} entities from base package {}", count, basePackage)
  }

}
</pre>

Here's how to use it with Spring JavaConfig:

<pre class="brush: scala">
@Bean
def entityManagerFactory = {
  val bean = new org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean
  // ... normal configuration
  bean.setPersistenceUnitPostProcessors(Array(new EntityScanningPersistenceUnitPostProcessor("my.entities.package")))
  bean
}
</pre>

The major downside in this approach is that some JPA tooling assumes that persistence.xml contains the entities that will be used.

They will fail because they at compile-time the persistence context seems empty!
