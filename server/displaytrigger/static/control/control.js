var socket = WebSocketReconnect({
    onopen: function() {
        console.log('connected');
    },
    onmessage: function(data) {
        //console.log('message', data);
    }
});


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
    $event_triggers = $('#event_triggers');
    $event_triggers.empty();
    $.each(data, function(i, data){
        $event_triggers.append(
            "<li><button onclick='socket.send($(this).data().event);' data-event='DATA'>EVENT_NAME</button></li>"
            .replace('EVENT_NAME', data.name)
            .replace('DATA', JSON.stringify(_.extend(data, data.params)).replace())
        );
    });
}

get_event_maps();