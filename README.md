Display Trigger
===============

Trigger displays/audio/events on an html5 document.


Overview
--------

When giving presentations at live events, you may not be able to phsically access
a machine. Sometimes powerpoint, airplay, chromecast or other tech just cant cut it.
You may need something with a bit more flexability. This project allows you to
send websocket events to a projector for display.

h3. Example use cases

h4. Live music

Live band have a projector behind them. At the mixing desk a technitian has a tablet.
By default a band logo projected. Some tracks have a video backing and can be triggered.

h4. Dynamic Presenter

A presenter is giving a presentation with a mobile phone and projector. Depending
on the audience reactions the presenter could take the slideshow in a differnt direction.

h4. Juggling Triggers





Implemented Features
--------------------


Proposed Features
-----------------

* Websockets for fast reacition
* Tigger types
  * Image
  * Audio
  * Video
  * IFrame
  * JS Function (with params) (subsiquent messages can be targeted to js)
* Local and remote assets (need to investigate security model)
* Simple HTML tigger app provided
  * Functional on mobile or desktop
* Trigger sequence queue
* API for more advanced use
  * precache events to ensure projector client responds quickly
  * events can be sent via http requests or a tcp connection
  * events can be sent with
    * type
    * src
    * 'now', 'sequence' or 'transient' (will disapear when other events are pushed)
    * volume
    * transition class 'fade', 'slide' and 'duration'
    * 'next_natural', 'next_terminate' (force next item)
