import {
    MapDefaultGet,
} from 'calaldees_libs/es6/core';
import {
    queryStringListOrInit,
} from 'calaldees_libs/es6/web';
import {
    text_to_note,
    note_to_text,
    normalize_javascript_midi_msg,
} from 'calaldees_libs/es6/music';
import {
    SubscriptionSocketReconnect,
} from 'multisocketServer/clients/js/msgpack_subscription_websocket';

import 'index.html';

// Constants

const QUERY_STRING_KEY_midi_input_device = 'midi_input_devicename';

const urlParams = new URLSearchParams(window.location.search);

let socket = null;
function initSubscriptionSocketReconnect() {
    socket = new SubscriptionSocketReconnect();
    socket.onConnected = () => document.getElementById('disconnected').style = 'display: none;';
    socket.onDisconnected = () => document.getElementById('disconnected').style = 'display: block;';
}

const event_lookup = new Map();
function load_eventmap(data) {
    // Create a lookup of events
    // Merge events bound to the same key/name together
    // index events by name and all event_names
    /*
    Example eventmap data
    [
        {
            "name": "test_image",
            "events": ["q", "note_on-C2"],
            "payload": [
                {"deviceid": "main", "func": "image.start", "src": "/assets/test.jpg", "className": "pixelated"}
            ]
        },
    ]
    */
    const event_lookup_get = MapDefaultGet(event_lookup, Array);
    for (let item of data) {
        event_lookup_get(item.name).push(...item.payload);
        for (let i of item.events) {
            event_lookup_get(i).push(...item.payload);
        }
    }
    return event_lookup;
}

function event_handler(event) {
    if (!socket) {console.warn(`unable to fire event ${event} - socket is not initalized`); return;}
    if (!event_lookup.has(event)) {console.warn(`event ${event} has not defined`); return;}
    console.log('event_handler', event);
    socket.sendMessages(...event_lookup.get(event));
}

function initEventButtons(event_names) {
    const event_buttons_container = document.getElementById('event_buttons');
    for (let event_name of event_names) {
        const element = document.createElement('button');
        element.textContent = event_name;
        element.addEventListener('click', ()=>event_handler(event_name), false);
        event_buttons_container.appendChild(element);
    }
}

// Keyboard input ------------------------------------------------------

document.addEventListener('keydown', (event) => event_handler(event.key));


// System Midi Input ---------------------------------------------------

function onMidiMessage(midiDevice, msg) {
    const midiMsg = normalize_javascript_midi_msg(msg);
    //console.debug(midiDevice.name, midiMsg);
    if (midiMsg.status.name == 'note_on') {
        event_handler(`${midiMsg.status.name}-${note_to_text(midiMsg.note)}`);
    }
    else {
        console.log('Only midi note_on events are currently supported. Other event could be implemented. Raise a feature request');
    }
};

function initMidiInputDevice(midiInputDevice) {
    // During midi binding - bind to named device or display device list in html
    if (
        urlParams.has(QUERY_STRING_KEY_midi_input_device) &&
        urlParams.get(QUERY_STRING_KEY_midi_input_device) == midiInputDevice.name
    ) {
        midiInputDevice.onmidimessage = (msg) => onMidiMessage(midiInputDevice, msg);
    }
    if (
        !urlParams.has(QUERY_STRING_KEY_midi_input_device)
    ) {
        const _urlParams = new URLSearchParams(urlParams);
        _urlParams.append(QUERY_STRING_KEY_midi_input_device, midiInputDevice.name);
        document.getElementById('midi_inputs').insertAdjacentHTML('beforeend', `<li><a href="${window.location.pathname}?${_urlParams.toString()}">${midiInputDevice.name}</a></li>`);
    }
}

function bindMidiDevices(midiAccess) {
    for (let midiInputDevice of midiAccess.inputs.values()) {
        initMidiInputDevice(midiInputDevice);
    }
};
function initMidi(bindMidiDevices) {
    if (window.navigator.requestMIDIAccess) {
        window.navigator.requestMIDIAccess({sysex: false}).then(bindMidiDevices, function() {console.warn('MIDI Access Failed');});
    } else {console.warn("No browser MIDI support");}
};
initMidi(bindMidiDevices);

queryStringListOrInit(
    'path_eventmap',
    'eventmap',
    '/eventmap/',
    data => {
        load_eventmap(data);
        initEventButtons(event_lookup.keys());
        initSubscriptionSocketReconnect();
    },
    ()=>null,
    document.getElementById('eventmaps'),
);
