---
title: Mooneye GB 0.1.0 released
date: 2015-09-27
categories: Mooneye GB
tags: Gameboy, Mooneye GB
---

<p class="text-center">
![Mooneye GB 0.1.0 screenshot](/images/2015/mooneye-gb-0.1.0.png)
</p>

I've decided that it's time to do a proper release of Mooneye GB after more than one year of
development. [Mooneye GB](https://github.com/Gekkio/mooneye-gb) is a Game Boy emulator project I
started last year, and it has been my main hobby project since then.

The first public commit in the repository is from Dec 18, 2014, but the project has actually a
longer history. The initial commit for my *private* Mooneye GB repository was done on Aug 31, 2014,
and some code was adapted from ocamlboy, which was an earlier attempt to build a Game Boy emulator
with OCaml. The initial commit for ocamlboy was made on June 2, 2014, but eventually my growing
interest in Rust won, and I ported all the existing code to something that later became Mooneye GB.

In case you are curious, here's a snippet of some early ocamlboy code:

```
let read_addr8 (cpu : cpu) (mem : Memory.mem) (mode : addr8_mode) : int = match mode with
  | Immediate ->
    let v = Memory.read8 mem cpu.regs.pc in
    begin
      cpu.regs.pc <- cpu.regs.pc + 1
    end;
    v
```

So, during the period of more than one year of research and emulator programming, what did I do?

* Wrote an emulator that passes several Blargg's tests
* Discovered a lot of inaccuracies in existing emulators. Even Gambatte is not perfect!
* Bought several Game Boy devices for hardware testing
* Bought almost 40 Game Boy games for in-detail cartridge analysis
* Wrote a lot of test ROMs
* [Designed breakout boards for the Game Boy cartridge slot](https://github.com/Gekkio/gb-hardware)
* [Dumped the boot ROM of Super Game Boy 2](/blog/2015-09-13-dumping-the-super-game-boy-2-boot-rom.html)
* Did some logic analysis on the Game Boy cartridge slot signals

And this is just the beginning...I think I have gotten more new questions than answers from my
research.

## What's in Mooneye GB v0.1.0?

This 0.1.0 release is not very exciting, but it is still an important milestone for the project. I'm
hoping that more Game Boy emulation enthusiasts will notice the project, and some people might
actually test the emulator on their systems.

Please note that Mooneye GB is above all a research project, and **if you want to actually play Game
Boy games, Mooneye GB is probably not the emulator for you**. Use
[Gambatte](https://github.com/sinamas/gambatte) or [BGB](http://bgb.bircd.org/) instead.

Mooneye GB **does not** currently have:

* support for save games
* audio
* a nice user interface
* full screen mode
* configurable key bindings
* configurable resolution
* Game Boy link support
* support for most Game Boy cartridge mappers
* support for any extra Game Boy cartridge features (e.g. infrared, rumble)
* support for any extra peripherals (e.g. camera, printer)

While developing Mooneye GB I've discovered inaccuracies in existing emulators and have discovered a
lot of knowledge about the Game Boy that has been so far undocumented. I'm very confident that other
people have found out some of the same things before, but so far it looks like people haven't often
documented their findings publicly. All you need to do is look at Pandocs; this document is widely
considered to be very valuable, but it is missing a huge amount of crucial details needed for
accurate Game Boy emulation.

My ultimate goal is to answer unanswered questions about the Game Boy, and provide some kind of
documentation that others can look at. So far the documentation has been mostly random notes and
comments in test ROMs and markdown files, but I might write a better document one day. And even
these small comments and document files are better than not having any information.

Since I'm releasing all information freely and publicly, other emulators can and probably will use
that information to improve their accuracy. This is perfectly ok, and I don't mind having competing
emulators that are better than Mooneye GB. My main goal is to improve Game Boy emulation for
everyone, so I don't really care at all if people use Mooneye GB or a better alternative.

## Where can I get it?

Windows 32-bit and 64-bit binaries are available from the [Github release page](https://github.com/Gekkio/mooneye-gb/releases/tag/v0.1.0).
Unfortunately I have no OS X or Linux binaries, because I don't have good build environments for them.
For these environments my recommendation is to check out the v0.1.0 tag from Github and build the
binaries yourself.

The source code package does not include dependencies, so building will require internet access and
I cannot guarantee the package will continue to build in the future. This is an unfortunate problem
with no good solutions at the moment (no, cargo-vendor is not yet good enough).

#### Special thanks to scyther, eagleflo, and many other people for their interest in the project, which has been a major motivator to me
