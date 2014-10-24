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

Live band have a projector behind them. At the mixing desk a technitian has a tablet.
By default a band logo projected. Some tracks have a video backing and can be triggered.

#### Dynamic Presenter

A presenter is giving a presentation with a mobile phone and projector. Depending
on the audience reactions the presenter could take the slideshow in a differnt direction.

#### Juggling Triggers



Implemented Features
--------------------

* None


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
    * cmd 
      * add (something to quque)
      * next (move to next)
      * return (request for info)
    * type
    * src
    * 'now', 'sequence' or 'transient' (will disapear when other events are pushed)
    * volume
    * transition class 'fade', 'slide' and 'duration'
    * 'next_natural', 'next_terminate' (force next item)

Message Format
--------------

### TCP Socket

Messages sent directly over the TCP socket should send messages as utf-8 json strings.

This is the message format the projector decodes.

    {
        func: 'trigger.precache|trigger.start|trigger.stop|...'

        // trigger.precache
        src: ['http://www.site.com/remote.mp4|/localfolder/localfile.xxx','...'],
        
        // trigger.start
        name: 'remote.mp4',
        
        // Stop
        name: '',        
    }

### HTTP Api

    curl 'http://localhost:6543/api/?cmd=add&mode=now&type=image&src=test.jpg'
    
    curl -XPOST 'http://localhost:6543/api/' -d '{cmd:"next", mode:"transition"}'

### Midi Triggers

Midi Triggers is a separete program to listen to midi events and convert them to TCP messages. The midi events will be mapped to TCP messages in a mapping file.

    {
        startup_triggers: [
            {
                cmd: 'precache',
                src: ['image1.jpg','image2.jpg']
            },
            {
                cmd: 'start',
                name: 'image1.jpg'
            }
        ],
        midi_mappings: [
            {
                channel: 1,
                note: 64,
                velocity_gt: 1,
                trigger: [
                    {
                        cmd: 'function',
                        function_name: 'display_splash',
                        params: ['blue', 25]
                    }
                ]
            },
        ]
    }
