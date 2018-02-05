---
title: "Errata for \"Reverse engineering fine details of Game Boy hardware\""
date: 2018-02-05
tags: Hardware, Game Boy
---

I held a presentation about Game Boy reverse engineering at Disobey 2018, a
security/hacking-oriented conference held in Helsinki. It was a really nice
chance to show off some of my tools and research results, and at least from my
point of view the presentation went really well! Here's a YouTube video of the
presentation:

<iframe width="560" height="315" src="https://www.youtube.com/embed/GBYwjch6oEE" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Unfortunately, even with a lot of preparation, some errors managed to creep
into the last section of the talk, because I happened to misread some of my own
notes about my very recent findings. Looks like I foreshadowed this in the talk
when I said "I'm not sure about all of this yet" ;)

### Data sampling

In the data sampling part (~31:00) I claim that by looking at the cartridge bus
signals, we can see that the data bus is sampled on the falling edge of the
machine cycle, so the sampling point is basically in the middle of the cycle.
However, there's an off-by-one error here, and the data sampling actually
happens one clock cycle later.

<img src="/images/2018/data-sample-wrong.svg" style="width: 100%">

<img src="/images/2018/data-sample-correct.svg" style="width: 100%">

Slightly later (~33:35) I explain that by abusing serial IO, we can see that
the CPU actually samples data internally at a different time (rising machine
clock edge). This is still correct, so the main points of this part are still
valid.

### Interrupt handling

In the interrupt handling part (~40:00) I explain how there are two different
clock edges involved in interrupt handling: "should we dispatch" and "where do
we jump to". The first edge (= "should we dispatch") is correct, but the second
clock edge is early by an entire machine cycle. So, the "where do we jump to"
edge is still on a falling machine clock edge, but it's the last one in the
interrupt dispatching phase and just 4 clock edges before the first interrupt
handler instruction clock edge!

<img src="/images/2018/intr-wrong.svg" style="width: 100%">

<img src="/images/2018/intr-correct.svg" style="width: 100%">
