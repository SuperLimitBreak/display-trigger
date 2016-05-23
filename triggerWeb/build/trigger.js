var socket = SubscriptionSocketReconnect({
        subscriptions: ['none'],
    },{
        
    }
);



function get_event_maps() {
    $.getJSON("/event_map/", {}, function(data) {
        //list_event_maps(data); return;
    if (data.length == 1) {load_event_map(data[0]);}
        else                  {list_event_maps(data);}
    });
}

function load_event_map(event_map_filename) {
    $.getJSON("/event_map/"+event_map_filename, {}, function(data) {
        generate_event_lookup(data);
        create_event_buttons(data);
    });
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

function create_event_buttons(data) {
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

var event_lookup = {};
function generate_event_lookup(data) {
    for (var item of data) {
        for (var event of item['events']) {
            if (event in event_lookup) {
                event_lookup[event].push(item);
            }
            else {
                event_lookup[event] = [item];
            }
        }
    }
}

function event_handler(event_key) {
    if (event_key in event_lookup) {
        var event_items = event_lookup[event_key];
        var flattened_payload = _.flatten(_.map(event_items, function(event_item){return event_item.payload}));
        console.log('send', _.map(event_items, function(event_item){return event_item.name}));
        //console.debug('send', flattened_payload);
        socket.send_message_array(flattened_payload);
    }
}

function onMidiMessage(midi_message) {
    var status = music.midi_status(midi_message.data[0]);
    var note = midi_message.data[1];
    var velocity = midi_message.data[2];

    if (status.name == 'note_on' && velocity == 0) {
        status = {code:0x8, name:'note_off', channel:status.channel};
    }
    if (status.name == 'note_on') {
        event_handler(status.name + '-' + music.note_to_text(note));
    }
    else {
        event_handler(status.name+'-'+midi_message.data.join('-'));
    }
}


function initMidi() {
    // http://webaudiodemos.appspot.com/slides/webmidi.html
    // http://www.keithmcmillen.com/blog/making-music-in-the-browser-web-midi-api/
    // http://www.toptal.com/web/creating-browser-based-audio-applications-controlled-by-midi-hardware
    // https://webaudio.github.io/web-midi-api/
    // https://www.w3.org/TR/webmidi/
    function bindMidiDevices(midiAccess) {
        var $midi_input_devices = $('#midi_input_devices');
        var midi_inputs = midiAccess.inputs;
        for (var midi_input of midi_inputs.values()) {
            $midi_input_devices.append("<option>NAME</option>".replace('NAME', midi_input.name));
        }
        if (!localStorage.midi_input_device_name) {
            localStorage.midi_input_device_name = midiAccess.inputs.values().next().name;
        }
        console.log('Binding to midi input', localStorage.midi_input_device_name);
        bindMidiDevice(localStorage.midi_input_device_name);
        
        $midi_input_devices.on('change', function() {
            localStorage.midi_input_device_name = this.value;
            bindMidiDevice(this.value);
        });
        function bindMidiDevice(midi_input_name) {
            unbindAll();
            // TODO: message for not found? see if you can use underscore.find?
            for (var midi_input of midi_inputs.values()) {
                if (midi_input.name == midi_input_name) {
                    midi_input.onmidimessage = onMidiMessage;
                }
            }
        }
        function unbindAll() {
            for (var midi_input of midi_inputs.values()) {
                midi_input.onmidimessage = null;
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