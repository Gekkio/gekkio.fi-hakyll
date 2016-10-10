---
title: Game Boy test ROM do's and don'ts
date: 2016-10-10
tags: Gameboy
---

Game Boy test ROMs are crucial tools for verifying the collective understanding
of the Game Boy hardware. Test ROMs can be executed on real Game Boys to check
that they test the right things, and they can also be executed on emulators to
check whether the emulator implements certain behaviour correctly.
Unfortunately writing good test ROMs is surprisingly difficult, and a badly
written test or incorrect interpretation of test results can greatly mislead a
hardware researcher or an emulator developer. In this blog post I describe some
ideas and recommendations I try to apply when writing test ROMs.

There are already some large test ROM suites:

* [Blargg's test ROMs](http://gbdev.gg8.se/files/roms/blargg-gb-tests/)
* [Gambatte test ROMs](https://github.com/sinamas/gambatte/tree/master/test/hwtests)
* [AntonioND's test ROMs](https://github.com/AntonioND/gbc-hw-tests)
* [Mooneye GB test ROMs](https://github.com/Gekkio/mooneye-gb/tree/master/tests)

Even though many test ROMs exist, I strongly recommend serious emulator
developers to write their own tests as well. I believe in independent
verification, so having multiple people implement tests independently should
give us more confidence that our collective knowledge is correct. On the other
hand, this of course assumes that the test ROMs are correct. I can personally
only vouch for my own tests, because I've executed them on all models and
hardware versions I have access to (which happens to be almost every existing
one). My test ROM code varies in quality, but the results are solid.

## *Do* test your ROM on real hardware

This might seem a no-brainer, but testing your ROM on real hardware is an
absolute must, unless your test ROM is intended for other purpose than testing
real hardware behaviour. You don't need to personally own all possible Game Boy
models and versions, but I recommend having more than one model, and asking
other developers to run your ROMs on their devices. We do want to understand
the differences between versions, but it's just misleading to claim some
behaviour as universal if it's limited to a single model or version.

As an example, Blargg's test ROMs are considered by many to be very fundamental
tests and some of the first ROMs a new emulator should attempt to pass.
However, not all of them pass on real hardware. For example, `cpu_instrs`
freezes on MGB (Game Boy Pocket) and SGB2 (Super Game Boy 2) devices and
emulators emulating them correctly. I find it shocking that I seem to be the
first one who has noticed this. I'm pretty sure the test would pass if it
wouldn't freeze, but this is a clear oversight and things like this could mask
real differences between models.

## *Don't* assume emulators or other test ROMs are always correct

I strongly recommend not using emulators as the main platform while writing
test ROMs. While emulators provide a much quicker compile-test-observe
-workflow, you're not testing real hardware and the emulator might not
implement all tested behaviour correctly. In the end you might still end up
with a test ROM that also works on hardware, but you might miss some insights
you could've had while developing the test ROM on real hardware. For example,
when I was making some OAM DMA tests ages ago, I made some mistakes which led
to a greater understanding of how OAM DMA behaves in conflict situations. If I
had developed the test ROM on an existing emulator that doesn't emulate the OAM
DMA conflicts correctly, I wouldn't have learned those things at the time.

You shouldn't assume other test ROMs are always correct either. If a test ROM
is verified on real hardware, the results might be certain but the test itself
might be testing the wrong thing. Even when your test and some other test are
superficially similar, it's possible they give very different results if one is
relying on some behaviour that is not the main focus of the test. For example,
PPU mode timings can be measured using at least these methods:

* interrupts
* `NOP` chains + `STAT` memory reads
* `LY` reads

Even though superficially you would be measuring the same thing, different
methods may lead to different results.

## *Do* try to write focused tests

Your goal for most test ROMs should be to focus on a single aspect of the Game
Boy hardware. It's perfectly fine to have more than one test case per test ROM,
but try to avoid relying on too many things. Every test builds on certain
assumptions about the hardware, but focusing on one thing makes it much easier
to develop the test and to debug the test on emulators and real hardware.

That being said, there is significant value in combination tests as well. I
plan to split my test development focus into two paths in the future:

* Simple and focused tests. For example, keep everything else constant, but
  vary SCX and measure some timings of the PPU
* Combination tests based on "data tables" of random data. For example,
  I could have a parameterized test that sets SCX, WX, sprites and measures PPU
  timings. Then I would randomly generate a big amount of parameter values, and
  save the parameters and corresponding result expectations into a big data
  table.

Simple tests are the most important tests, but combination tests can reveal
unexpected interplay between things and/or incorrect understanding of the
hardware. For example, some emulators claim to pass my sprite tests, but I have
100% confidence that they don't implement the underlying behaviour correctly
when we also consider mid-scanline register writes and interplay between
different register values.

## *Don't* use `HALT` if you want to measure interrupt timings

I mentioned briefly in my [previous status blog post](/blog/2016-10-04-game-boy-research-status.html)
that the `HALT` instruction affects the timing of interrupt handlers on pre-CGB
devices.  The timing difference is not random, so for example if a test works
on a certain DMG unit, the `HALT` effects will be the same on all other pre-CGB
devices. There are several Mooneye GB tests that are split into separate `-GS`
(pre-CGB) and `-C` (CGB and beyond) tests because the timings are different.
This `HALT` weirdness is the reason, and in retrospect I should've used a simple
"field of `NOP`s" technique to wait for interrupts. I will at some point fix my
tests, but for now I will simply try to warn other people. My test ROM results
are still valid, but the effect of `HALT` mangles the resulting timing values
so it's more difficult to see the timing patterns of the thing being tested.

## *Do* publish your results and source code, and try to make it readable

This one might seem quite obvious as well, but you should make your test ROM
source code public. Even if the ROM is perfectly correct, our collective
understanding depends on sharing of information, which includes source code.
Making assembly source code readable is a much more difficult task. There are
two main competing assemblers with differences in syntax and semantics, and
assembly language itself is challenging due to its low-level nature.

Personally I have the sources of all of my published tests in the Mooneye GB
Github repository. I have more tests on local hard drives, but they haven't
been tested yet on real hardware, or are otherwise incomplete. I also try to
leave some important comments in the source code.

## *Don't* limit your mental model to the world of 1MHz cycles

This is the reason why I don't use test ROMs at the moment as the main tool for
research. Since test ROMs run on the Game Boy CPU and the CPU executes memory
reads and writes in machine cycles, the ROMs see the hardware through "1MHz
machine cycle glasses". However, the real world actually works with 4MHz clock
cycles or even 8MHz clock edges. This leads to the fact that it's sometimes
very difficult to understand what the underlying hardware is doing. It's also
why I choose to use test ROMs mainly for verification and focus my research
efforts on more invasive but effective methods.

Let's take a simple example: interrupt handling. Here I have an example timing
diagram of a program that executes two instructions: `INC B` and `INC C`.  We
assume that `B=0`, `C=0` and interrupts are enabled before these two
instructions start executing. Now, the question is: if we could trigger an
interrupt at will in any of the moments labeled `a` to `q`, what is the
first moment (starting from `a`) where the interrupt happens too late to
prevent the instruction `INC C` from running? In other words, when should an
interrupt happen so that we have `B=1` and `C=0` in the interrupt handler?

```
            a b c d e f g h i j k l m n o p q
            |   |   |   |   |   |   |   |   |
              |   |   |   |   |   |   |   |

4MHz clock: _|‾|_|‾|_|‾|_|‾|_|‾|_|‾|_|‾|_|‾|_|

1MHz clock: _|‾‾‾‾‾‾‾|_______|‾‾‾‾‾‾‾|_______|

Address:         |   $0200   |   |   $0201   |
Data:            |   $04     |   |   $0C     |
Instruction:     |   INC B   |   |   INC C   |
```

It's probably obvious that if an interrupt happens at `a`, we jump to the
interrupt handler quite early, the instruction `INC C` is not executed and even
`INC B` might be skipped.  But what about `g` or `i`? Is one of them the right
answer, and if not, which one is closer? If we control the interrupt, we could
just run a test case for each of the moments of time and see when the behaviour
changes. This is what is possible with more invasive tools than test ROMs.

In practice, with test ROMs we face the opposite challenge: we can alter the
interrupt timing, possibly even at 4MHz accuracy (e.g. add sprites to delay PPU
STAT interrupts), but we don't know at which time the interrupt triggers
exactly. With careful planning we can count the number of full instructions
executed and measure a ballpark number with 1MHz cycle accuracy. But if our
goal is to understand the internal behaviour of the system to develop an
accurate model, guessing `a` when the right moment is `h` is a massive error in
the 4MHz world in which the hardware works. In some cases it might not matter,
while in other cases we will have an incorrect model. A simple 4MHz world
hardware state machine might be converted into a horribly complicated
1MHz-based model with magic +1 or -1 cycle amounts with no explanation. If this
is the only type of evidence guiding our way of thinking, we are doomed.

I hope this explains why I haven't followed the gambatte way of writing
hundreds of test ROMs (which still didn't give a model accurate enough to pass
my tests!!). I'm still hoping that the underlying hardware makes more sense
than it seems, and we just haven't seen it through the right 4MHz (or 8MHz!)
point of view.

*PS. It's too early to talk about the right answer to this interrupt question,
but I can tell that it's probably not `a` or `i`, and the timing might depend
on the interrupt source.*

## *Do* mention test ROM versions when you talk about them

This one is extremely important: if you claim that your emulator passes certain
tests, always mention the test ROM versions!  Blargg's test ROMs are numbered,
so the version is clear if you use the right name, but for example Mooneye GB
tests change once in a while, and the test names themselves don't indicate
which version was used. Either use a timestamp (e.g. `2016-09-31`) or a git
commit hash (e.g. `4d8e5be71eb539be783eb4e0b807b907954e7d49`). Also provide
some version scheme for your own tests; if you use git (like you should!), a
simple commit hash should be fine.
