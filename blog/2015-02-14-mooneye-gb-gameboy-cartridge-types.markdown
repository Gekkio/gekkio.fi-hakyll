---
title: Mooneye GB: Gameboy cartridge types
date: 2015-02-14
categories: Mooneye GB
tags: Gameboy, Mooneye GB
---

When I started developing [Mooneye GB](https://github.com/Gekkio/mooneye-gb), I did the initial work in small gradual steps. I started by emulating things that the Gameboy bootrom uses, so I could see the Nintendo logo animation. After that, I only focused on games which have only a simple 32K ROM (e.g. Tetris). I could've continued with Tetris for a long time, for example by perfecting the GPU emulation or adding sound support, but eventually I got bored and wanted to try some more interesting games. This meant I had to start emulating the Gameboy cartridge hardware.

Like many other old game consoles, Gameboy uses cartridges which can in theory contain any custom hardware, as long as the cartridge pinout is the same and makes sense from the Gameboy's point of view. This is a major challenge for emulator writers, because testing and successfully emulating known games might not be possible just by focusing on the main system. For example, some Super Nintendo games contain extra DSP chips (e.g. Super-FX) which significantly complicate development.

Luckily most official Gameboy games can be grouped into a small amount of categories based on which MBC (memory bank controller) and other chips they have. Unlicensed games can have more obscure chips or cheap replicas, but we are going to focus only on the official games.

## The need for MBCs

Most Gameboy games contain some kind of MBC chip. The most obvious reason for this is the limited 16-bit address space of the Gameboy CPU. In order to support bigger games, the MBC chips are used to do banking, which provides games with the ability to map different parts of the ROM into the Gameboy memory.

The Gameboy memory map has two areas for ROM banks: $0000 - $3FFF and $4000 - $7FFF. The first area always contains bank 0, which is at $0000 - $3FFF on the actual ROM chip. The second area can point to some other bank, which is determined by the MBC hardware.

In order to better understand what is really happening, it is necessary to look at the actual cartridge hardware. We'll start with the cartridge pinout, which is the "interface" between the Gameboy CPU and the cartridge hardware.

## Gameboy cartridge pinout

The cartridge connector has 32 pins, where most of the pins are used for the individual data and address bits:

     1: VCC   5V voltage
     2: CLK   CPU clock signal (AFAIK unused)
     3: WR    Write signal
     4: RD    Read signal
     5: CS    Chip select (used for SRAM). Sometimes called MREQ

     6: A0  -\
      ....    Address
    21: A15 -/

    22: D0  -\
      ....    Data
    29: D7  -/

    30: RST   Reset signal
    31: VIN   Cartridge audio signal (AFAIK unused)
    32: GND   Ground

## Reading from the ROM

Now, let's assume the CPU wants to read a byte from address $4242. The CPU sets the bits in the address lines A0-A15 according to the address (e.g. 0100 0010 0100 0010), and signals a read request using the RD pin. The first 14 address lines are usually directly connected to the ROM, so the ROM can see a "masked view" of the actual address. Note that the ROM chip might have much more address lines! The high bits of the final address are actually coming from MBC output lines. For example, a 1 MB rom (2^20 bytes) has 20 address lines, and requires an MBC chip with enough output lines. So, we could have A0-A13 connected to the cartridge header, and A14-A19 connected to the MBC chip. The ROM itself has no knowledge of banking. If it has more than 14 address lines, an MBC chip always manages the high bits of the address. So, in practice an emulator could model the ROM as a big byte array, and model the MBC internal state and thus the high bits of the final address. Also, note that the ROM always has exactly the right amount of address lines (depending on the ROM size), so it is not possible to use "out of bounds" addresses to read from the ROM. Any wrapping or other behaviour with incorrect addresses is caused by other factors.

The exact details of how the MBC chip is connected depends on the MBC chip, other hardware, and the ROM/RAM sizes. We'll have to look at each combination individually.

## Analysis of known MBC chips

I own cartridges with almost all the possible combinations of MBC chips, ROM and RAM sizes. In future blog posts, my plan is to analyze both from a hardware and software point of view all these combinations. I recently bought a [InsideGadgets Gameboy Cart Shield](https://www.insidegadgets.com/projects/gameboy-cart-shield/) v1.2, which I'm using to peek and poke (haha) the cartridges.

So, here's all the MBC types, and links to blog posts about them if I've written any. There is no MBC4.

### No MBC

### MBC1

### MBC2

### MBC3

### MBC5

### MBC6

### MBC7

### Pocket Camera

### TAMA5

### HuC-1

### HuC-3

### MMM01

## Unreliable cartridge header documentation on the internet

**If you are building any Gameboy tool or emulator that inspects the cartridge header data, don't trust even the Pandocs!!**

Github user AntonioND has correct documentation here: [https://github.com/AntonioND/giibiiadvance/tree/master/docs](https://github.com/AntonioND/giibiiadvance/tree/master/docs)

Here's a list of common issues with the cartridge type, rom size, and ram size information:

- Includes MBC4 which doesn't exist
- Wrong type for Pocket Camera (0x1F is incorrect, 0xFC is correct)
- Doesn't include MBC5
- Doesn't include MBC6
- Doesn't include MBC7
- Includes weird ROM sizes $52, $53, $53 (72, 80, 96 banks). They don't exist (at least in official games)
- Doesn't include ROM sizes $07, $08 (256, 512 banks).
- Incorrect RAM sizes (e.g. $03 = 128Kbit is wrong, 256Kbit is right)
- Doesn't include RAM size $05 (512 Kbit, 8 banks)

Here's some tools and documents that have issues:

- Pandocs
- GB crib sheet
- The "file" utility on most Linux/BSD systems
- GBCPUMan
