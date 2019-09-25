import {queryStringListOrInit} from 'calaldees_libs/es6/web';
import {SubscriptionSocketReconnect} from 'multisocketServer/clients/js/websocket';
import {ScreenMessageRouter} from './screen/ScreenMessageRouter';


const Immutable = require('immutable');

require('normalize.css/normalize.css');
require('./styles/main.scss');

import 'index.html';

// Constants

const body = document.getElementsByTagName('body').item(0);


const DEFAULT_SCREEN_CONFIG = Immutable.fromJS({
    'main': {
        'id': 'default_screen',
        'classList': undefined,
        'style': undefined,
        'subscriptions': [],
    },
});


function newSubscriptionSocketReconnect() {
    const socket = new SubscriptionSocketReconnect();
    const onConnected = socket.onConnected;
    const onDisconnected = socket.onDisconnected;
    socket.onConnected = () => {
        document.getElementById('disconnected').style = 'display: none;';
        onConnected.call(socket);
    };
    socket.onDisconnected = () => {
        document.getElementById('disconnected').style = 'display: block;';
        onDisconnected.call(socket);
    };
    return socket;
}


function initScreens(screenConfig) {
    const config = screenConfig.get('_config', Immutable.fromJS({}));
    const screenMessageRouter = new ScreenMessageRouter(
        newSubscriptionSocketReconnect()
    );
    for (const [screen_name, screen_data] of screenConfig) {
        if (screen_name.startsWith('_')) {continue;}
        const id = screen_data.get('id');
        let element = document.getElementById(id);
        if (!element) {
            element = document.createElement('div');
            element.id = id;
            body.appendChild(element);
        }
        //element.classList.concat(screen_data.get('classList'));
        element.style = screen_data.get('style');
        screenMessageRouter.bindScreen(screen_name, element, Array.from(screen_data.get('subscriptions')), config);
    }
}


const urlParams = new URLSearchParams(window.location.search);


if (urlParams.has('subscriptions')) {
    console.log('subscriptions given in querystring - startup in single screen mode');
    initScreens(Immutable.fromJS({
        "main": {
            "id": "main",
            "classList": null,
            "style": "position:absolute; left:0; right:0; top:0; bottom:0;",
            "subscriptions": urlParams.get('subscriptions').split(',').map((_string) => _string.trim()),
        }
    }));
}
else {
    console.log('Hint: To start in single display mode - pass `subscriptions` as a csv in the querystring');
    queryStringListOrInit(
        'path_displayconfig',
        'displayconfig',
        `${window.location.protocol}//${window.location.hostname}/displayconfig/`,
        data => initScreens(Immutable.fromJS(data)),
        () => initScreens(DEFAULT_SCREEN_CONFIG),
        body,
    );
}