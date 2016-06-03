---
title: "Mooneye GB: A Gameboy emulator written in Rust"
date: 2015-01-13
categories: Rust, Mooneye GB
tags: Rust, Gameboy, Mooneye GB
---

Recently my main hobby project has been [Mooneye GB](https://github.com/Gekkio/mooneye-gb), a Gameboy emulator written in Rust. There's quite a lot of Rust Gameboy emulators, but Mooneye GB is unique: my main focus is accuracy based on rigorous hardware testing. If we move our focus away from Rust, the king of all Gameboy emulators is Gambatte, which is based on similar principles but the documentation is not that good.

While writing my emulator, I noticed that there's actually quite little precise documentation about the Gameboy hardware even though I've studied all the well-known documentation (Pan docs, GBCPUMan, Nintendo's Gameboy Programming Manual, crib sheets, even the Nintendo patents). Since I have some real hardware and a flash cart, I now develop Mooneye GB by combining knowledge from existing documentation with results of test ROMs which are run using real devices (currently Gameboy Pocket, Gameboy Color, Gameboy Advance SP). I also try to document things well enough for others to follow, so my emulator could work as a reference if someone is curious about some corner cases or hardware behaviour.

As an example, let's look at the PUSH/POP instructions, which work on a target 16-bit register. POP takes 3 machine cycles (= 12 clock cycles, but I like to use m cycles instead), while PUSH takes 4 machine cycles. Most emulators implement POP BC and PUSH BC like this:

```rust
let op = read_op();
match op {
  // ...
  0xC1 => { // POP BC
    cpu.bc = mem_read_u16(cpu.sp);
    cpu.sp += 2;
    cpu.cycles += 3;
  },
  0xC5 => { // PUSH BC
    cpu.sp -= 2;
    mem_write_u16(cpu.sp, cpu.bc);
    cpu.cycles += 4;
  }
  // ...
}
```

This might seem perfectly fine, but is actually inaccurate if we look at the itty-bitty details. If we access a part of memory where timing matters, we might end up emulating the real hardware incorrectly. For example, the VRAM in the Gameboy is only accessible during certain times. If we try to access the VRAM when it's inaccessible, our reads will return 0xFF and writes will have no effect.

## POP timing

Let's imagine that the stack pointer points to some part of VRAM, and we have the following timing:

    0  1  2  3  4  5  6  7  | time (cycles)
    -------------------------------
    *  *  *  *  *  *        | VRAM accessibility (* = inaccessible)
                P0 P1 P2    | CPU (POP instruction cycles)

The previous emulation code essentially runs the entire instruction at t=4, but VRAM accessibility changes while the instruction is being executed. We need per-cycle accurate emulation. Based on a [POP test](https://github.com/Gekkio/mooneye-gb/blob/master/tests/pop_timing/test.s), the individual cycles execute the following operations:

    P0: Memory read and instruction decoding
    P1: Memory read for the low byte
    P2: Memory read for the high byte

So, with real hardware the CPU would see 0xFF for the low byte, but the real value for the high byte.

## PUSH timing

What about PUSH? We essentially do the same thing in reverse, but we now have 4 cycles in total:

    0  1  2  3  4  5  6  7  | time (cycles)
    -------------------------------
    *  *  *  *  *  *        | VRAM accessibility (* = inaccessible)
                P0 P1 P2 P3 | CPU (PUSH instruction cycles)

Once again, the previous emulation code runs everything at t=4. Also, PUSH actually has one cycle of some kind of internal delay, so the memory accesses have even more possible timings. Based on a [PUSH test](https://github.com/Gekkio/mooneye-gb/blob/master/tests/push_timing/test.s), the individual cycles execute the following operations:

    P0: Memory read and instruction decoding
    P1: Internal delay
    P2: Memory write for the high byte
    P3: Memory write for the low byte

So, with real hardware the push would succeed normally, even though VRAM is only accessible 50% of the time spent executing the instruction!

PUSH timing is actually something that Gambatte gets wrong, because the internal delay is at the end of the instruction. So, with Gambatte we would have memory writes at P1-P2, and only the low byte would be written.

## Accurate emulation

If we aim for accuracy, we must emulate correctly the individual cycles and all observable behaviour of hardware during these cycles. A fairly simple and accurate way of emulation would look something like this:

```rust
let op = read_op();
cycle_tick_emulate_hardware();

match op {
  // ...
  0xC1 => { // POP BC
    let lo = mem_read_u8(cpu.sp);
    cpu.sp += 1;
    cycle_tick_emulate_hardware();

    let hi = mem_read_u8(cpu.sp);
    cpu.sp += 1;
    cycle_tick_emulate_hardware();

    cpu.bc = ((hi as u16) << 8) | (lo as u16);
  },
  0xC5 => { // PUSH BC
    cycle_tick_emulate_hardware();

    cpu.sp -= 1;
    mem_write_u8(cpu.sp, (cpu.bc >> 8) as u8);
    cycle_tick_emulate_hardware();

    cpu.sp -= 1;
    mem_write_u8(cpu.sp, cpu.bc as u8);
    cycle_tick_emulate_hardware();
  }
  // ...
}
```

This is what Mooneye GB does currently, but I'm working on improving the efficiency by only emulating things that have observable side-effects. For example, if the memory writes of PUSH are done to internal RAM, we don't have to emulate any other hardware at that point. Essentially the hardware state should be lazily evaluated. I'm honestly curious how easily this would work with lazily evaluated languages such as Haskell...
