display
=======

is the 'display' in *display*Trigger

A html5 client to drive multiple screens from triggers.
This was designed to display videos and other dynamic content on multiple projected screens for live music performances.
Videos can be triggered to play when a song starts.
Although live music was it's initial usecase, the concept could be utilized in other domains.

The concept of *display* has now moved way beyond just triggering videos.
Below are some of the types of trigger plugins the system currently supports.

* Video
* Audio
* Text Overlays
* Fullscreen Fades

Old V1.0 functionality that needs to be re-implemented

* MaskOverlay (crop/feather display with an image mask)
* iFrame
    * Currently used for voteBattle
* Pentatonic Hero
* Subtitle Prompts
* Smooth Background Scroller (replaced with GASP)

Future ideas

* Sprite renderer (unimplemented concept)
* WebRTC video surfaces (unimplemented concept)
* Screen Scrablers (unimplemented concept)
* Multilayer Emulator (unimplemented concept)
* Realtime Particle Effects (unimplemented concept)
* Juggle Trigger (unimplemented concept)


Current State of Development
-----------------------------

`display/build` is old depreciated v1.0 reference and is not in use.

`display` has now been re-implemented in webpack/es6.
