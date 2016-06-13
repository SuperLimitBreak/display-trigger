Display Trigger
===============

Trigger displays/audio/events on an html5 document.

TODO: This document is wildly out of date and needs a complete overhaul. May more features and functions have been added.


Overview
--------

When giving presentations at live events, you may not be able to phsically access
a machine. Sometimes powerpoint, airplay, chromecast or other tech just cant cut it.
You may need something with a bit more flexability. This project allows you to
send websocket events to a projector for display.

### Example use cases

#### Live music performance

Live band have a projector behind them (with an html5 projector interface).
By default a band logo projected. Some tracks have a video accompliament.
A digital audio workstation can output to a virtual midi port and send midi signals that trigger the start/stop 
backing videos/images.

At the mixing desk a technitian may have a tablet pc that can trigger videos/images

As well as triggering videos on an html5 projector, it could be possible to link
these video triggers with lighting triggers to display DMX lights.


#### Dynamic Presenter

A presenter is giving a presentation while holding a mobile phone and projecting the html projector interface.
Depending on the audience reactions the presenter could take the slideshow in a differnt direction with a varity of presetup triggers.



Architecture
------------

3 core components. trigger -> server -> display

* trigger
    * description
    * triggerWeb
        * Midi
        * UI
    * triggerPython (deprecated)
* server
    * description
* display
    * description

Exmaple flow
------------

todo

* Virtual Midi Client
  * Midi events can trigger a json payload stored in a mapping file. These payloads are sent via a network to the html5 projector.
* DisplayTrigger server that recives events via TCP/Websockets/HTTP and forwards this to all listeners.
* A HTML5 projecor interface capable of displaying images, audio, video, executing functions, displaying text overlays, etc

* precache events to ensure projector client responds quickly
