Display Trigger
===============

Trigger displays/audio/events on an html5 document.


Overview
--------

When giving presentations at live events, you may not be able to phsically access
a machine. Sometimes powerpoint, airplay, chromecast or other tech just cant cut it.
You may need something with a bit more flexability. This project allows you to
send websocket events to a projector for display.

### Example use cases

#### Live music

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


#### Juggling Triggers

A set of juggling balls made from a fine copper mesh chould be juggled with gloves
sencing the hold/release of the metal balls. These could be detected by an arduino
that outputs the ball state over a wireless rs232 adaptor. A reciving machine can forward these
events to the trigger system


#### PentatonicHero

A guitar hero controler has been mapped from a joystick input to produce midi notes on the pentatonic scale.
The infomation of what notes are pressed are sent to the trigger system for visulisation.



Implemented Features
--------------------

* Virtual Midi Client
  * Midi events can trigger a json payload stored in a mapping file. These payloads are sent via a network to the html5 projector.
* DisplayTrigger server that recives events via TCP/Websockets/HTTP and forwards this to all listeners.
* A HTML5 projecor interface capable of displaying images, audio, video, executing functions, displaying text overlays, etc

* Tigger types
  * Image
  * Audio
  * Video
  * IFrame
  * JS Function (with params) (subsiquent messages can be targeted to js)
* Local and remote assets
* API for more advanced use
  * precache events to ensure projector client responds quickly
* Additional Modules
  * Pixel Background Scroller (smoothy scrolling images fullscree)
  * SRT Subtitle Prompter (Trigger onscreen subtitle prompts for karaoke)


Proposed Features
-----------------

* Simple HTML tigger app provided
  * Functional on mobile or desktop


Message Format
--------------

### TCP Socket

Messages sent directly over the TCP socket should send messages as utf-8 json string on a single line.

This is the message format the projector decodes.

    {
        func: 'trigger.precache|trigger.start|trigger.stop|...'

        // trigger.precache
        src: ['http://www.site.com/remote.mp4|/localfolder/localfile.xxx','...'],
        
        // trigger.start
    }


### HTTP Api

    curl 'http://localhost:6543/event/trigger.empty'
    
    curl -XPOST 'http://localhost:6543/event/' -d '{func:"trigger.start", src:"/static/assets/test.jpg"}'


### Midi Triggers

Midi Triggers is a separete program to listen to midi events and convert them to TCP messages. The midi events will be mapped to TCP messages in a mapping file.
see client README.md


### HTML Trigger App

in planning (will use same map file as midi triggers)