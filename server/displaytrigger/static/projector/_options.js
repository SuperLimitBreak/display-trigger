var options = {
    image: {
        
    },
    audio: {
        default_event_listeners: {
    		seeked: function(event){
				socket.send_message({func: 'DMXRendererLightTiming.seek', currentTime: event.target.currentTime});
			}
        }
    },
    video: {
        target_selector: '#screen',
        default_event_listeners: {
            ended: function(event){
                console.log("video ended");
                $.publish('trigger.empty', null);
            }
        },
    },
    fader: {
        
    },
    overlay: {
        
    },
    webrtc_video: {
        
    },
    subtitles: {
        
    },
    background_scroller: {
        backgrounds: {
            castelvania_1: {
                background_url: '/ext/castlevaniafullgamemapempty.PNG',
                source_screen_height: 168,
                source_width: 9928,
                source_height: 1908,
            },
            castelvania_sotn: {
                background_url: '/ext/sotn-castle.png',
                source_screen_height: 206,
                source_width: 15648,
                source_height: 12000,
            },
            super_metroid: {
                background_url: '/ext/SuperMetroidMapZebes.png',
                source_screen_height: 240,
                source_width: 16896,
                source_height: 14336,
            },
            super_metroid_cut: {
                background_url: '/ext/SuperMetroidMapZebes_cut.png',
                source_screen_height: 240,
                source_width: 3074,
                source_height: 240,
            }
        },
        scrolls: {
            castelvania_1: [
                {
                    background: 'castelvania_1',
                    name: "Castelvania: Outside",
                    startX: 0,
                    startY: -1563,
                    endX: -752,
                    duration: '5s',
                },
                {
                    background: 'castelvania_1',
                    name: "Castelvania: First hall",
                    startX: -767,
                    startY: -1550,
                    endX: -2304,
                    duration: '5s',
                },
                {
                    background: 'castelvania_1',
                    name: "Castelvania: Bridge",
                    startX: -2096,
                    startY: -590,
                    endX: -4510,
                    duration: '5s',
                },
                {
                    background: 'castelvania_1',
                    name: "Castelvania: Drop",
                    startX: -4260,
                    startY: -590,
                    endY: -1896,
                    duration: '2s',
                },
                {
                    background: 'castelvania_1',
                    name: "Castelvania: Cave",
                    startX: -4256,
                    startY: -1724,
                    endX: -5790,
                    duration: '5s',
                },
                {
                    background: 'castelvania_1',
                    name: "Castelvania: Bridge 2",
                    startX: -7610,
                    startY: -1026,
                    endX: -6106,
                    duration: '5s',
                },
            ],
            misc: [
                {
                    background: 'super_metroid_cut',
                    name: "Super Metroid: Morph ball",
                    startX: 0,
                    startY: 0,
                    endX: -2700,
                    duration: '10s',
                },
                {
                    background: 'castelvania_sotn',
                    startX: -528,
                    startY: -8968,
                    endX: 2000,
                    duration: '30s',
                },
                {
                    background: 'super_metroid',
                    startX: -4100,
                    startY: -7200,
                    endX: -6916,
                    duration: '10s',
                },
            ]
        }
    },
    penatonic_hero: {
        
    },
    votebattle: {
        
    }
};