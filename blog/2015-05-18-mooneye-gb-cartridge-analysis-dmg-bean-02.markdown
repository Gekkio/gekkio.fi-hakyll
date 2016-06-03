---
title: "Mooneye GB: Cartridge analysis - three games with DMG-BEAN-02 boards"
date: 2015-05-18
categories: Mooneye GB
tags: Gameboy, Mooneye GB
---

In my previous blog post I analyzed a Gameboy cartridge with a DMG-BEAN-01 circuit board. This time
we'll take a look at three DMG-BEAN-02 games. I didn't trace the connections, because the
DMG-BEAN-02 board seems to be identical to DMG-BEAN-01. I'm sure there's some kind of slight change
to justify the version number, but I wasn't able to find any practical difference.

## Bomber Boy

Bomber Boy a.k.a Atomic Punk a.k.a Dynablaster is the first Bomberman game released on the Gameboy.
For some reason they decided to have a different name for the game in every major region (JP, EU,
US).

<p class="text-center">
<a href="/images/gameboy-boards/DMG-BEAN-02.DMG-HBA.jpg">
<img alt="" width="600" src="/images/gameboy-boards/DMG-BEAN-02.DMG-HBA.small.jpg">
</a>
</p>

My cartridge has the code *DMG-HBA*, which is the Japanese release of the game (= Bomber Boy), and
the ROM dump matches with "Bomber Boy (J) [!].gb" in the GoodGBX database. This time we have a
1 Mbit (= 128 KB) ROM, which is larger than in the previous blog post. We have one extra address
line, so we have a 17-bit address space ($00000 - $1FFFF).

<div class="gbpcbvis">
  <a href="/images/gameboy-boards/DMG-BEAN-02.DMG-HBA.front.jpg">
    <img alt="" width="400" src="/images/gameboy-boards/DMG-BEAN-02.DMG-HBA.front.small.jpg">
  </a>
  <a href="/images/gameboy-boards/DMG-BEAN-02.DMG-HBA.back.jpg">
    <img alt="" width="400" src="/images/gameboy-boards/DMG-BEAN-02.DMG-HBA.back.small.jpg">
  </a>
</div>

As expected, the board has an MBC1 chip, and a Sharp LH5308ND ROM chip labeled with DMG-HBA-0. The
connections are the same as last time with one exception: this time M16 is connected to a valid pin
on the ROM. I used a **Sharp LH530800A** datasheet as a comparison point, but the pin layout is
actually a JEDEC standard so there's nothing surprising here.

## WWF Superstars

<p class="text-center">
<a href="/images/gameboy-boards/DMG-BEAN-02.DMG-LW-USA.jpg">
<img alt="" width="600" src="/images/gameboy-boards/DMG-BEAN-02.DMG-LW-USA.small.jpg">
</a>
</p>

My cartridge has the code *DMG-LW-USA*, so it's the US release. The corresponding GoodGBX entry is
"WWF Superstars (UE) [!].gb", so apparently the European version has the same ROM. This game is also
1 Mbit (= 128 KB).

<div class="gbpcbvis">
  <a href="/images/gameboy-boards/DMG-BEAN-02.DMG-LW-USA.front.jpg">
    <img alt="" width="400" src="/images/gameboy-boards/DMG-BEAN-02.DMG-LW-USA.front.small.jpg">
  </a>
  <a href="/images/gameboy-boards/DMG-BEAN-02.DMG-LW-USA.back.jpg">
    <img alt="" width="400" src="/images/gameboy-boards/DMG-BEAN-02.DMG-LW-USA.back.small.jpg">
  </a>
</div>

Once again, we have an MBC1 chip, but this time we have a Toshiba ROM chip: TC531001CF labeled with
DMG-LWE-0. Unlike the previous ROM chips, this chip actually has a public data sheet! However, it
uses the standard layout so there's nothing special about it.

## Gauntlet II

<p class="text-center">
<a href="/images/gameboy-boards/DMG-BEAN-02.DMG-G2-UKV.jpg">
<img alt="" width="600" src="/images/gameboy-boards/DMG-BEAN-02.DMG-G2-UKV.small.jpg">
</a>
</p>

My cartridge has the code *DMG-G2-UKV*, so it's the UK release, and the dump matches with "Gauntlet
II (U) [!].gb" in the GoodGBX database. The game has a 2MBit (= 256 KB) ROM.

<div class="gbpcbvis">
  <a href="/images/gameboy-boards/DMG-BEAN-02.DMG-G2-UKV.front.jpg">
    <img alt="" width="400" src="/images/gameboy-boards/DMG-BEAN-02.DMG-G2-UKV.front.small.jpg">
  </a>
  <a href="/images/gameboy-boards/DMG-BEAN-02.DMG-G2-UKV.back.jpg">
    <img alt="" width="400" src="/images/gameboy-boards/DMG-BEAN-02.DMG-G2-UKV.back.small.jpg">
  </a>
</div>

Once again we have an MBC1 chip, and a Toshiba ROM chip: TC532000BF labeled with DMG-G2E-0. Since it
is a bigger ROM than previously, now also M17 is connected to a valid pin.

## What's next?

This time we didn't see anything exciting in the cartridges. The DMG-BEAN boards seem to be very
common, so I think most RAMless classic Gameboy games use that same board layout. Having said that,
I'm going to analyze an exception to that rule in the next blog post: Super Chinese Fighter GB. It
has an 8Mbit (= 1 MB) ROM chip, so it needs 20 address pins and thus doesn't fit the DMG-BEAN
layout.

After analysing Super Chinese Fighter, I'm going to move on to games with RAM chips. We're going to
look at two different RAM sizes, and also an MBC1 game that has a 16Mbit ROM chip, which is the
maximum supported by MBC1. Then it's time to peek and poke the cartidges with some test software,
and we can summarize the analysis of MBC1 and figure out how to emulate the chip's behaviour
properly.
