display
=======

is the *display* in displayTrigger

A html5 client to drive multiple screens from triggers.
This was designed to display videos and other dynamic content on multiple projected screens for live music performances.
Videos can be triggred to play when a song starts.
Although live music was it's initial usecase, the concept could be utilised in other domains.

The concept of _display_ has now moved way beyond just triggering videos.
Below are some of the types of trigger plugins the system currenty supports.

* Video
* Audio
* Text Overlays
* Fullscreen Fades
* MaskOverlay (crop/feather display with an image mask)
* iFrame
    * Currently used for voteBattle
* Pentatonic Hero
* Subtitle Prompts
* Smooth Background Scroller
* Sprite renderer (unimplemented concept)
* WebRTC video surfaces (unimplemented concept)
* Screen Scrablers (unimplemented concept)
* Multilayer Emulator (unimplemented concept)
* Realtime Particle Effects (unimplemented concept)
* Juggle Trigger (unimplemented concept)


Next Step
---------

_Multiple screens are not currently implemented; this is the next intended refactor._

The current mvp of _display_ needs to be reworked to support

* es6/7 webpack karma
* Multiple displays
