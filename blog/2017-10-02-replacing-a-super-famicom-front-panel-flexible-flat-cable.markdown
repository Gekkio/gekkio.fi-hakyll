---
title: "Replacing a Super Famicom front panel flexible flat cable"
date: 2017-10-02
tags: Hardware, modding, Super Famicom
---

I own an SFC (Super Famicom, "Japanese SNES") that I use for running hardware
tests on Super Game Boy and Super Game Boy 2 systems. My SFC has been modded
with a SuperCIC mod so I can also use a PAL Super Game Boy with it.
Unfortunately I got the SFC a fairly long time ago when I didn't have that much
experience with electronics and console hardware, so I was very sloppy and
ended up damaging the unit in multiple ways.

Time for some SFC modding hall-of-shame photos!

## SFC modding gore

![CIC pads should *not* look like this after desoldering the chip](/images/2017/sfc_modding_gore_1.jpg)

![Horror...none of these pins even need to be touched in this mod!](/images/2017/sfc_modding_gore_2.jpg)

![The front panel flat cable doesn't like it when you bend it like this...](/images/2017/sfc_modding_gore_3.jpg)

## Fixing my mistakes

Undoing the mainboard damage was straightforward: I just got a replacement
board and redid the mod, but this time I was much more careful and had better
tools available. For example, desoldering the CIC was much easier with hot air,
and no pads were lifted.

![Much better CIC desoldering result](/images/2017/desoldered_cic.jpg)

The flat cable was another story: I only had a mainboard replacement and no
other spare parts. After doing some measurements, I estimated the cable pitch
to be 1.27mm. For some reason 1.27mm FFC parts are extremely rare, even on ebay
and AliExpress. However, the cable is just a 11-way cable so I figured a 1.25mm
pitch cable would only have a very small alignment error. I managed to find
potentially suitable 11-way 1.25mm FFC parts, but they were out of stock! It
looks like 11 signals is a very unpopular choice. In the end I decided to buy a
12-way 1.25mm cable from Digi-Key and try to mod it into a 11-way cable. A
[Molex 0982680177](https://www.digikey.fi/product-detail/en/molex-llc/0982680177/WM14922-ND/3470362)
cable seemed to be a good candidate.

The Molex cable was eventually shipped, and I found out that it fit nicely in
the connectors on both ends after cutting a tiny bit off.

![Cut Molex cable](/images/2017/molex_ffc_cut.jpg)

This particular cable is 6" (~15cm) in length, so it's a bit longer than the
original. However, there's enough room in the case for the cable so it's not a
big problem. The length is not optimal but everything worked fine!

![Final result with replacement cable installed](/images/2017/molex_ffc_installed.jpg)

## Conclusion

There you have it! If you ever need to replace a SFC front panel flexible flat
cable, look for 1.25mm pitch FFC parts, and buy a 11-way cable or cut a bit off
a 12-way cable.
