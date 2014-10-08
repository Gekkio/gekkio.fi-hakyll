---
title: Calling Win32 API with Rust FFI
date: 2014-10-08
categories: Rust
brushes: Rust
tags: Rust, Windows
---

I was recently looking for a simple Windows utility to turn off the screen, and I wanted it to be open source so I could compile it myself and be sure it doesn't do anything malicious. There are plenty of options available, but in the end I decided to implement it myself to learn a bit about [Rust](http://rust-lang.org) on Windows.

Rust is a systems programming language focusing on safety while retaining low-level programming language features whenever possible. I find it extremely interesting, because it feels fresh and modern, but allows me to develop programs for use cases typically restricted to C/C++. So far Rust has had a similar effect to me as Haskell: writing code changes the way I think about programming in general. Rust forces you to think about ownership and scoping, and incorrect or unsafe code does not compile by default.

Rust is still very much in flux, so I cannot guarantee the code in this post works at the time of reading.

## How to (incorrectly) turn off the screen on Windows

I had very little knowledge about the Win32 API, so I started by searching for some ideas about how to turn off the screen. Stackoverflow showed me that [a single Win32 API call](http://superuser.com/questions/321342/turn-off-display-in-windows-7-without-additional-software) could do the trick. So, we need to use the `SendMessage` call to broadcast a `WM_SYSCOMMAND` message with `SC_MONITORPOWER`, although the API call I ended up using is actually the more asynchronous call `SendNotifyMessage`.

**Note:** This is actually *not* the right way, but seems to work so we can focus on wrapping just a single Win32 API call with the FFI. More information about the wrong way(s) and the right way can be found in [Raymond Chen's blog](http://blogs.msdn.com/b/oldnewthing/archive/2006/06/13/629451.aspx). In a nutshell, broadcasting is wrong and the right way would be to create our own window to be passed to the call.

By looking at the [MSDN documentation about SendNotifyMessage](http://msdn.microsoft.com/en-us/library/windows/desktop/ms644953(v=vs.85).aspx), it seems that we need to know the types `BOOL`, `HWND`, `UINT`, `WPARAM`, `LPARAM` in our FFI interface. MSDN also has a comprehensive list of [Windows data types](http://msdn.microsoft.com/en-us/library/windows/desktop/aa383751(v=vs.85).aspx), which contains information about all the types we need. The list also explains that many of the mentioned types are actually just typedefs to other things, so in practice we also need to know the types `HANDLE`, `PVOID`, `UINT_PTR`, `LONG_PTR`,

## Creating the FFI module

Rust FFI doesn't support directly importing a C/C++ header file unless some extra tools (e.g. rust-bindgen) are used, so we have to fully understand what's going on in the header file, and replicate the same interface in the Rust code. This is actually surprisingly tricky, because the header file might include a lot of preprocessor macros, including #ifdefs for different platforms and different compilation settings. We need to be able call this function: `BOOL SendNotifyMessage(HWND, UINT, WPARAM, LPARAM)`.

### Types

In order to minimize extra work, we'll first look at Rust libc module, which contains many of the types and functions for platform libraries. At the time of writing, the Rust API docs show everything from a POSIX operating system's point of view. So, for example the list of re-exported (pub use) symbols in the documentation don't include any Windows stuff, so we have to look at the Rust module source code to figure out what symbols are available and which of them are re-exported. The types `BOOL`, `HANDLE`, `LONG_PTR` are already available, and having `HANDLE` drops the need for `PVOID`.

By looking at the Windows data types list, [MSDN C Runtime Reference](http://msdn.microsoft.com/en-us/library/323b6b3k.aspx), and the Rust libc module source code, it looks like the rest of the types are actually just C95/C99 types. `UINT` corresponds to `libc::c_uint`, and `UINT_PTR` corresponds to `libc::uintptr_t`. This holds for both 32-bit and 64-bit platforms.

### Constants

Constants are quite annoying, because have to duplicate them in the FFI module. Luckily the documentation for `SendNotifyMessage` and [WM_SYSCOMMAND](http://msdn.microsoft.com/en-us/library/windows/desktop/ms646360(v=vs.85).aspx) include the actual values for `HWND_BROADCAST`, `WM_SYSCOMMAND` and `SC_MONITORPOWER`.

### Functions

On Windows, many of the functions have Unicode and ANSI versions, and the standard names are actually just #ifdef aliases to the specific functions. Rust doesn't care, so we link to the Unicode function directly (`SendNotifyMessageW`). Two important things have to be considered when creating a function call binding: linking to the right library, and using the right call convention. The function documentation on MSDN specifies that the right library is `user32`. Call convention has to be figured out from the header. The original C function definition uses the `WINAPI` macro, which resolves to `__stdcall`.

### Wrapping up the module

I think it's a good idea to keep all the names of types and functions exactly the same as in the target API. By default Rust warns about non-camel-case types such as `BOOL`, so we need to explicitly allow them with an annotation. Combining all the earlier work we end up with the following FFI module:

<pre class="brush: rust">
#[allow(non_camel_case_types)]
mod ffi {
  use libc::{c_uint, uintptr_t};
  use libc::types::os::arch::extra::{BOOL, HANDLE, LONG_PTR};

  type UINT = c_uint;
  type UINT_PTR = uintptr_t;
  type HWND = HANDLE;
  type WPARAM = UINT_PTR;
  type LPARAM = LONG_PTR;

  pub static HWND_BROADCAST: HWND = 0xffff as HWND;
  pub static WM_SYSCOMMAND: UINT = 0x0112;
  pub static SC_MONITORPOWER: WPARAM = 0xf170;

  #[link(name = "user32")]
  extern "stdcall" {
    pub fn SendNotifyMessageW(hwnd: HWND, msg: UINT, wParam: WPARAM, lParam: LPARAM) -> BOOL;
  }
}
</pre>

The extra cast in `0xffff as HWND` is needed, because the type `HWND` is a void pointer, which is not compatible with integer literals.

## Using the FFI module

Calling the module is straightforward because we are wrapping a very simple function. All FFI calls require an unsafe block, so let's encapsulate the call in a normal function:

<pre class="brush: rust">
fn lcd_off() {
  unsafe {
    // 2 (the display is being shut off)
    ffi::SendNotifyMessageW(ffi::HWND_BROADCAST, ffi::WM_SYSCOMMAND, ffi::SC_MONITORPOWER, 2);
  }
}
</pre>

## Finishing touches

### Console window flash
If you compile the application and run it, you'll notice a quick console window flash. This is caused by the fact that Rust compiles applications by default as Windows console applications. To avoid the annoying flash, we need to add linker arguments specifying subsystem as "windows". As far as I know, the only way to do this is to pass raw arguments using `link_args`:

<pre class="brush: rust">
// Link as "Windows application" to avoid console window flash
#[link_args = "-Wl,--subsystem,windows"]
extern {}
</pre>

### Removal of std

This little application doesn't need the Rust standard library, which increases the binary size to megabytes. It's possible to avoid the standard library, which results in a binary with size in the scale of tens of kilobytes.
[Writing Unsafe and Low-Level Code in Rust](http://doc.rust-lang.org/guide-unsafe.html) describes the required steps in detail.

## Final words

The application is fairly simple and works fine. However, the use of `HWND_BROADCAST` is incorrect, so using a custom window would be much better.

Source code for the application can be found in [Github lcdoff-rs project](https://github.com/Gekkio/lcdoff-rs).
