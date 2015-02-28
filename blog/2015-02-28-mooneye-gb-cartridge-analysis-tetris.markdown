---
title: Mooneye GB: Cartridge analysis - Tetris (no MBC)
date: 2015-02-28
categories: Mooneye GB
tags: Gameboy, Mooneye GB
---

In my previous blog post, I described the reasons why MBC chips are included in Gameboy game cartridges. Before we start looking at such cartridges, it's a good idea to first look at a game that doesn't use an MBC. We start our Gameboy cartridge analysis journey by first looking at a very popular game with very simple hardware: Tetris.

<p class="text-center">
<a href="/images/gameboy-boards/DMG-TRA-1.DMG-TR-SCN-1.jpg">
<img width="600" src="/images/gameboy-boards/DMG-TRA-1.DMG-TR-SCN-1.small.jpg">
</a>
</p>

The cartridge I own has the code *DMG-TR-SCN-1*. [The release data at Gamefaqs](http://www.gamefaqs.com/gameboy/585960-tetris/data) doesn't include this ID for some reason, but based on the patterns in other IDs I think SCN might be a Scandinavian release. I've also dumped the ROM, and it matches with "Tetris (W) (V1.1) [!].gb" in the well-known GoodGBX database.<br>
So, we are probably looking at a **Scandinavian release of Tetris 1.1**, although the GoodTools code `(W)` suggests the ROM seems to be same worldwide, so the regional differences are probably only in packaging and labels.

### PCB visualization

I like using visualization to understand things, so I've built an SVG-based Gameboy cartridge PCB visualization tool, which can be used to inspect the connections between the different components and pins on a board. The code is very hacky, but works fairly well (but only in modern browsers!). This tool is included in this post and I'll try to have it in future posts as well!

Try the tool by pressing the loading button below, and hovering or clicking on the image and the connection list.

## Cartridge PCB (printed circuit board)

<div id="pcb-ui">
<div id="pcb-ui-controls" style="display: none">
<input id="pcb-ui-size-small" type="radio" name="pcb-ui-size" value="small" checked>
<label for="pcb-ui-size-small">Small</label><br>
<input id="pcb-ui-size-large" type="radio" name="pcb-ui-size" value="large">
<label for="pcb-ui-size-large">Large</label><br>
<div id="pcb-ui-connections"></div>
</div>

<div id="pcb-ui-images">
<a href="/images/gameboy-boards/DMG-TRA-1.DMG-TR-SCN-1.front.jpg">
<img width="400" src="/images/gameboy-boards/DMG-TRA-1.DMG-TR-SCN-1.front.small.jpg">
</a>
<a href="/images/gameboy-boards/DMG-TRA-1.DMG-TR-SCN-1.back.jpg">
<img width="400" src="/images/gameboy-boards/DMG-TRA-1.DMG-TR-SCN-1.back.small.jpg">
</a>
</div>

</div>
<div style="clear: both"></div>

<script src="//code.jquery.com/jquery-2.1.3.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/3.3.1/lodash.min.js"></script>
<script src="/js/gameboy-pcb-ui.js"></script>
<script>
  $(function() {
    pcb_ui.plant_button(pcb_ui.cartridge_connections, [
      '/images/gameboy-boards/DMG-TRA-1.DMG-TR-SCN-1.front.svg',
      '/images/gameboy-boards/DMG-TRA-1.DMG-TR-SCN-1.back.svg'
    ]);
  });
</script>

The first important thing to notice is the PCB IDs: *DMG-TRA-1* (front) and *AAAC S* (back). Gameboy games with similar hardware usually have similar PCBs, although there might be minor differences between revisions. The ROM is of course always different, but the PCB layout might be identical between several games.

The second thing to notice is the low amount of components on the board. The only IC (integrated circuit) is the ["Glop top"](http://en.wikipedia.org/wiki/Electronic_packaging#Glop-top)-packaged ROM. This type of packaging unfortunately prevents us from seeing the chip itself, so we can't see the ROM chip model or any actual pins.

### Connections on the PCB

The following pins are not connected: CLK, WR, MREQ, RS, VIN. On the other hand, all address pins and data pins are connected, so they could be used to address the full 16-bit address space (2^16 = $0000 - $FFFF), and transfer complete 8-bit bytes.

So, we have 16 address lines connected, but an MBC-less ROM only supports two ROM banks, which corresponds to a 15-bit address space (2^15 = $0000 - $7FFF). This might seem odd at first, but there's a job for the 16th address pin: the address lines are shared between multiple components, so when a read request is issued, there has to be a way to control which device handles the request. The solution is to have CS (chip select) active-low signals, which let a component know it should handle the read request.

We can't see the actual pins or the ROM chip, but I'm making an educated guess: A15 is actually connected to the CS pin in the ROM chip. Since CS is an active-low signal, having 0 in bit 15 causes the ROM chip to handle read requests. When does the address bit 15 have the value 0? When the address is $0000 - $7FFF, which is exactly what the ROM address space is.

**Fun fact:** Since RS is not connected, you can actually take the Tetris cartridge out of a Gameboy without the console resetting itself. An internal pull-up resistor in the Gameboy keeps the RS line up (= inactive).

### Notes for emulators

What things should we consider when emulating ROMs like this?

* The two ROM banks in $0000 - $7FFF could be emulated with just an array of bytes
* WR is not connected, so writes are ignored
* The cartridge header data doesn't allow ROMs smaller than 32Kbit, so there's always exactly two ROM banks if no MBC is used
* It's in theory possible to have a RAM chip as well, but there are no official games that have RAM but no MBC
