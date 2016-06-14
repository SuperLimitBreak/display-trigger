trigger
=======

is the _trigger_ in displayTrigger.

TODO


Message Format
--------------

### TCP Socket

Messages sent directly over the TCP socket should send messages as utf-8 json string on a single line.

This is the message format the projector decodes.

    {
        todo
    }


### HTTP Api

_outdated_

    curl 'http://localhost:6543/event/trigger.empty'
    
    curl -XPOST 'http://localhost:6543/event/' -d '{func:"trigger.start", src:"/static/assets/test.jpg"}'


### Midi Triggers

Midi Triggers is a separete program to listen to midi events and convert them to TCP messages. The midi events will be mapped to TCP messages in a mapping file.
see client README.md


### HTML Trigger App

in planning (will use same map file as midi triggers)