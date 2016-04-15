var socket = SubscriptionSocketReconnect({
        subscriptions: ['none'],
    },{
        
    }
);

var event_map = {};

function get_event_maps() {
    $.getJSON("/event_map/", {}, function(data) {
        //list_event_maps(data); return;
    if (data.length == 1) {load_event_map(data[0]);}
        else                  {list_event_maps(data);}
    });
}

function load_event_map(event_map_filename) {
    $.getJSON("/event_map/"+event_map_filename, {}, set_event_map);
}

function list_event_maps(data) {
    $event_triggers = $('#event_triggers');
    $event_triggers.empty();

    $.each(data, function(i,event_map_filename){
        $event_triggers.append(
            "<li><button onclick='load_event_map(\"EVENT_MAP_FILENAME\");'>EVENT_MAP_FILENAME</button></li>"
            .replace('EVENT_MAP_FILENAME', event_map_filename)
            .replace('EVENT_MAP_FILENAME', event_map_filename)
        );
    });
}

function set_event_map(data) {
    event_map = data;
    $event_triggers = $('#event_triggers');
    $event_triggers.empty();
    $.each(data, function(i, data){
        $event_triggers.append(
            "<li><button onclick='socket.send_message_array($(this).data().event);' data-event='DATA'>EVENT_NAME</button></li>"
            .replace('EVENT_NAME', data.name)
            .replace('DATA', JSON.stringify(data.payload).replace())
        );
    });
}

function onMidiMessage(midi_message) {
    // TODO: es6 unpacking?
    var channel = midi_message.data[0];
    var input = midi_message.data[1];
    var value = midi_message.data[2];
    console.log(channel, input, value);
}


function initMidi() {
    // http://webaudiodemos.appspot.com/slides/webmidi.html
    // http://www.keithmcmillen.com/blog/making-music-in-the-browser-web-midi-api/
    // http://www.toptal.com/web/creating-browser-based-audio-applications-controlled-by-midi-hardware
    // https://webaudio.github.io/web-midi-api/
    // https://www.w3.org/TR/webmidi/
    function bindMidiDevices(midiAccess) {
        var $midi_input_devices = $('#midi_input_devices');
        for (var midi_input of midiAccess.inputs.values()) {
            $midi_input_devices.append("<option>NAME</option>".replace('NAME', midi_input.name));
        }
        //$midi_input_devices.onselected = function() {
        //    localStorage.midi_input_device_name = this.selected.name;
        //    bindMidiDevice(localStorage.midi_input_device_name);
        //};
        function bindMidiDevice(midi_input_name) {
            unbindAll();
            for (var midi_input of midiAccess.inputs.values()) {
                if (midi_input.name == midi_input_name) {
                    midi_input.onmidimessage = onMidiMessage;
                }
            }
        }
        function unbindAll() {
            for (var midi_input of midiAccess.inputs.values()) {
                input.onmidimessage = null;
            }
        }
    }
    if (window.navigator.requestMIDIAccess) {
        window.navigator.requestMIDIAccess({sysex: false}).then(
            bindMidiDevices,
            function() {console.warn('MIDI Access Failed');}
        );
    } else {
        console.warn("No browser MIDI support");
    }
}


get_event_maps();
initMidi();