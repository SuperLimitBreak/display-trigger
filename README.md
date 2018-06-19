displayTrigger
===============

Trigger video/audio/lighting events to be displayed by a html5 display.

`displayTrigger` is part of the [SuperLimitBreak.uk](http://superlimitbreak.uk) tech stack.


Overview
--------

When giving presentations at live events, you may not be able to physically access
a machine. Sometimes powerpoint, airplay, chromecast or other tech is insufficient.

You may need something with a bit more flexibility.

This project allows you to send/trigger events via websocket/tcp/curl to a projection machine for display.


### Example use cases

#### Live music performance

Live band have a projector behind them (with an html5 projector interface).
By default a band logo projected. Some tracks have a video accompaniment.
A digital audio workstation can output to a virtual midi port and send midi signals that trigger the start/stop 
backing videos/images.

At the mixing desk a technician may have a tablet pc that can trigger videos/images

As well as triggering videos on an html5 projector, it could be possible to link
these triggers with a dmx lighting system to synchronise lights.


#### Dynamic Presenter

A presenter is giving a presentation while holding a mobile phone and projecting the html projector interface.
Depending on the audience reactions the presenter could take the slideshow in a differnt direction with a varity of presetup triggers.



Architecture
------------

3 core components. `trigger` -> `server` -> `display`

* `triggerWeb`
    * loads and `eventMap` of json payloads. Each payload can be _triggered_ with either UI interaction, Midi event or joystick (currently unimplemented)
    * A json payload contains a list of commands and destinations
        * e.g. A command to start 'hello.mp4' on a projector and start a dmx light sequence called 'hello' at the same time.
    * Web implementation
            * UI buttons - Can be used on a tablet
            * Midi - Cubase can trigger events at points in a live set
* `server2`
    * webserver
    	* Serves `triggerWeb`, `display`, event video/audio assets, `eventMap`s
    * `subscription_server`
        * clients can be plain TCP or Websocket based.
        * Echos a received json `eventMap` payload to clients that are _subscribed_  to a deviceid.
        * e.g. start 'hello.mp4' on deviceid=main and start light sequence 'hello' on deviceid deviceid=lights
* `display`
    * A html5 client initialised with a deviceid that connects via a websocket to `subscription_server`.
    * When an `eventMap` payload is received it displays the relevant assets or runs the requested function.


Example `eventMap`
-----------------
	[
        {
            "name": "track_precache",
            "events": ["-", "note_on-D0"],
            "payload": [
                {"deviceid": "main", "func": "video.precache", "src": "/assets/video.mp4"},
                {"deviceid": "subtitles", "func": "subtitles.load", "src": "/assets/video.srt", "play_on_load": false}
            ]
        },
        {
            "name": "track_play",
            "events": ["=", "note_on-D#0"],
            "payload": [
                {"deviceid": "main", "func": "video.start", "src": "/assets/video.mp4", "volume": 0},
                {"deviceid": "lights", "func": "LightTiming.start", "sequence": "video_lights", "bpm": 175.0},
                {"deviceid": "subtitles", "func": "subtitles.load", "src": "/assets/video.srt", "play_on_load": true}
            ]
        },
        {
            "name": "track_text_overlay",
            "events": ["p", "note_on-C#0"],
            "payload": [
                {"func": "overlay.html_bubble", "deviceid": "main", "html": "<h1>TrackName</h1><p>Overlay some cool semi transparent text for the audience</p>"}
            ]
        }
    ]


Example Flow
------------

Cuebase Music Project -> Midi Track with note_on events -> Virtual Midi port -> `triggerWeb` -> `eventMap` payload sent to `subscription_server` -> inpect payload and forward via tcp or websocket to the correct client with deviceid -> `display` actions the command by displaying the video/subtitles/function.
