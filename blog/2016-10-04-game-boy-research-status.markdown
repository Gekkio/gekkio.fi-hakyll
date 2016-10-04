---
title: "Game Boy research status, September 2016"
date: 2016-10-04
tags: Gameboy
---

It's been a while since the last time I wrote anything about Game Boys. Unlike
what it might seem, I haven't stopped doing research or working on my emulator.
It's the complete opposite: I've been very busy setting up better tooling for
hardware testing, which will hopefully lead us to the "end-game" of Game Boy
research where most questions are answered. I've decided to start writing a
monthly or bi-monthly summary of stuff I've studied and results I've
discovered. The main focus is on pulling back the curtain a bit on my Game Boy
work, so I will mostly just list random things instead of trying to write very
clearly thought posts. Lowering the barrier of writing should make it easier to
have enough time to write these things.

Anyway, without further ado, here are some things I've worked on or thought
about recently:

## Early DMG boot ROM dump and CPU differences

I found out that early DMG units had a different boot ROM, which flashes the
screen instead of scrolling a block if the Game Boy is started without a
cartridge. I successfully dumped this boot ROM, and it's now in the No-Intro
database.

That being said, I also realized something today: I've got an early unit with
CPU labeled as "LR35902" and another unit with CPU labeled as "DMG-CPU". I
can't remember which one I dumped, and there's also a possibility that these
are two different versions. At the moment I'm still assuming they are the same,
but this needs more testing.

## Hardware revisions

I've watched ebay very closely and acquired a lot of Game Boy hardware
versions. Very soon I should have all the CPU versions, which are the most
important things for research. I already have all known mainboard versions of
everything except SGB and AGS units.

## Game Boy hardware database

I'm building a website that will have a big database and photo album of Game
Boy units, games, and accessories. I have around 70 Game Boy units, and I'm
collecting precise data from them, including stuff like chip date codes, board
stamps, and serial numbers. The serial numbers have already been a huge help in
making educated guesses about which Game Boys to buy from ebay.

## GB-LIVE32 rapid development cart

The GB-LIVE32 rapid development cart is the main hardware project I've been
working on for two years. It's nothing very complicated, but I've had to learn
a lot of skills to make the cart reality. The first PCB I designed was the
GB-BRK-M board, but the main goal has always been to practice things bit by bit
to finally have the skillset to create this rapid development cart.

The cart is based on some very simple requirements:

I want to have a USB cable connected to a cart in a Game Boy, and update the
ROM without unplugging any cables. The Game Boy should also restart
automatically after a ROM update without any manual touching of power switches
or other things. Updates can be done in parallel to multiple Game Boy units
with a USB hub + multiple carts.

No cartridge RAM or any kind of MBC is needed for running my test ROMs, so the
implementation can be quite simple:

* Program memory for the $0000-$7FFF area --> *32 Kbit SRAM chip*
* A way to isolate the SRAM from the Game Boy cartridge bus --> *5V tolerant 3-state buffers*
* A way to toggle the RST pin --> *5 V tolerant open-collector buffer*
* A microcontroller for updates and control --> *PIC microcontroller*
* USB connectivity --> *the chosen PIC MCU also has USB, so no extra chip is needed*

I plan to open source everything (including the board design) once I work out
some kinks and improve the software. The cart itself has worked since the v1.0
design and software, so the improvements are relatively minor. Parallel testing
made it much quicker to run mooneye-gb tests on real hardware, so I was able to
very quickly confirm test results on previously untested but accessible
hardware revisions.

## Automated hardware testing

While I'm still improving the GB-LIVE32 cart, my main focus has shifted to an
automated Game Boy hardware testing system. The idea is to have the capability
to run a huge amount of tests with slightly different parameters and gather
results without human intervention. For example, PPU timings are very
complicated and depend on multiple factors, and it would make research much
easier if I could simply write a simple test generator that runs a certain test
with slightly different parameters. Even a simple thing like measuring how many
cycles something takes is much more difficult to implement in a test ROM than
with a hardware testing platform that could simply control the clock and count
the number of clock edges until a certain event happens.

I already have the first version of the system working, but it needs a lot of
improvements to make things truly automated. However, I already have full
control of the clock and the CPU, so I can for example do these things:

* count clock cycles/edges
* inject a byte to any memory read (= I can inject instructions or data to
  the CPU)
* skip the boot ROM if I want to (= replace the instruction at $0000
  with `JP $0100`)
* observe addresses of some memory accesses normally not visible in the
  cartridge bus (e.g. boot ROM reads)

## HALT on DMG/SGB/MGB/SGB2 has strange delays

Using HALT on pre-CGB devices can lead to the CPU waking up later than
intended. I don't understand this behaviour yet, but I'm pretty sure I've seen
delays up to 6 cycles. The following diagram is from my notes and might be
inaccurate:

```
time in M-cycles
--------------------->
EH...........I
E.H................I
E..H.........I
E...H.........I
E....H..........I
E.....H.........I
E......H..........I

E = EI instruction
H = HALT instruction
. = NOP instruction
I = interrupt handler
```

In all cases the interrupt source is unchanged so the interrupt happens at the
same time, but for some reason the interrupt handler timing varies. The only
thing that changes is the amount of NOP instructions between EI and HALT.
There's plenty of NOPs after HALT so the problem can't be that HALT and the
interrupt would be too close together.
