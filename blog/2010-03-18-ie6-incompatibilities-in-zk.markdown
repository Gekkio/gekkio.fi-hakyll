---
title: IE6 incompatibilities in ZK
date: 2010-03-18T15:57:43+01:00
categories: Java
brushes: Xml
tags: Internet Explorer 6, ZK
---

There's a very annoying IE6 incompatibility in ZK.

<pre class="brush: xml">
&lt;window title="I hate IE6" border="normal"&gt;
  &lt;popup id="popup"&gt;
    &lt;label value="Fail" /&gt;
  &lt;/popup&gt;
  &lt;label value="Click me" popup="popup" /&gt;
&lt;/window&gt;
</pre>

When you click the label "Fail", you'll get a popup that is sized by its contents....  
.... except in IE6 where the popup always has 100% width.

This can of course be fixed by specifying a fixed width for the popup, but this is typically ugly. If the application supports localization, you'll be forced to guess a good width for all localizations.
