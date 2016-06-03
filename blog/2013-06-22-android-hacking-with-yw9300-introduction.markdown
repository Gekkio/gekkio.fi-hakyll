---
title: "Android hacking with YW9300: Introduction"
date: 2013-06-22T18:48:00+02:00
categories: Android
tags: Android, YW9300, hacking, Cyanogenmod
---

I've spent a huge chunk of my free time this week on learning Android internals by tinkering with an Android device called YW9300. It's a reasonably cheap device with a powerful SoC (system-on-a-chip) called Exynos 4412 (officially "Exynos 4 Quad"). This is the same chip that exists in every Galaxy S III phone, and is also used in some other Samsung and 3rd party products. My goal was to create a bootable custom ROM with Android 4.2 ("Jelly Bean"), because I was unsatisfied with the stock ROM supplied by the manufacturer (I'll explain later why). <del>I ended up failing my goal and bricking the device, but</del> I thought I should share my experiences, so other people could use the knowledge I have gained, and avoid the mistakes I did. <ins>Update: I thought I had already tried it, but I managed to recover using an original update.zip!</ins>

## What exactly is YW9300?

YW9300 is an Android TV box device from a Chinese manufacturer called YW Terminal. The device is marketed as a cheap multimedia device to be used with a TV, and it comes with XBMC and a media player preinstalled. The device includes a built-in 802.11n wireless adapter, but has no Bluetooth or Ethernet. At the moment of writing the price of the cheaper model with 1GB memory and 8GB internal storage was $120.

Exynos 4412 is a very powerful SoC at this price point, and the only real competitors are some Allwinner, Rockchip, and i.MX devices. There is a cheaper device (ODROID U2) with Exynos 4412, but I like the minimalistic approach of YW9300 and the fact that it already has a case. The only problem in my opinion is the software, which was a major disappointment.

### Issues with the stock ROM

#### Android version

The manufacturer and sellers claim that it contains Android 4.2.1, but actually it is 4.0.x. This is easily verifiable by looking at the build.prop file that I will explain in a later post. Even the device itself says Android 4.2.1 in the About-section, but that is wrong and seems to be just the manufacturer trying to trick people. Claiming they have Android 4.2.1 _and_ support for Flash should already ring the alarm bells, because Flash does _not_ work on Android 4.2+.

#### USB camera support

The marketing material correctly mentions that there is no internal camera or microphone, but they still give the impression that external devices could be used for video chat (e.g. Skype). Based on my testing their kernel does NOT include the uvcvideo driver, which would be required for most USB webcams.

#### Hardware decoding

While Exynos 4412 supports hardware decoding of many formats, the MediaCodec API required for using such codecs in Android apps was added in API level 16 (= Android 4.1.x). The native hardware decoding libraries exist in the system, but as far as I know they are pretty much useless without the MediaCodec API. Claiming support for hardware decoding is most likely just a result of the Android version confusion mentioned above.

#### 1080P freezing / HDMI problems

I haven't seen these problems myself, but W2comp.com has stopped selling the boxes due to these issues. These might of course be issues with Samsung source code, which would then appear in custom ROMs too, but at least with a custom build there would be no need to wait for the manufacturer to fix the issues.

## Cyanogenmod 10.1 as the custom ROM

The software wasn't good enough for me, and this was a great opportunity to learn more about Android internals, so I decided to build my own custom ROM with Android 4.2.x, and all the needed features. **I strongly recommend all serious Android developers to do some tinkering with custom ROMs, because it is an extremely useful learning experience.**

At this point you might be wondering why I chose CM (Cyanogenmod):

*   It is the most popular custom ROM, and is actively developed and maintained
*   I'm already using it on my HTC One X, so I'm familiar with it
*   At the time of writing, CM 10.1 nightlies had experimental support for Exynos 4412 devices like Galaxy S III
*   The standard AOSP source code doesn't support Exynos 4, and while the necessary source code is available from other sources, CM has already retrieved everything into their Github repositories

On the other hand, choosing CM did lead to some issues:

*   The Exynos 4412 code was still too much in flux, and mixed sometimes incompatible versions of third party libraries
*   The codebase is geared towards phones and tablets, while the YW9300 is a TV box. This made it a bit difficult to strip away all the phone-like stuff (radio, camera, gps, nfc, etc.)

The first issue was a major source of complications, because some libraries simply didn't compile correctly due to too old dependencies. The second issue is getting better all the time, because CM 10.1 has introduced support for the ODROID-U2 development board. Too bad I initially missed this and used Galaxy S III code as the template :cry:

Still, even with these two issues I think CM was the right choice. Most other notable ROMs use CM as the base and just add some cool extra stuff, so I think it was simpler to just use the default CM code without any additions. In the next blog post I'll take a closer look at the hardware so we'll know what we are dealing with.
