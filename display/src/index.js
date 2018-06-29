import {SubscriptionSocketReconnect} from 'calaldees_libs/es6/websocket';
import {queryStringListOrInit} from 'calaldees_libs/es6/web';
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



function initScreens(screenConfig) {
    const config = screenConfig.get('_config', Immutable.fromJS({}));
    const screenMessageRouter = new ScreenMessageRouter(
        new SubscriptionSocketReconnect()
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


queryStringListOrInit(
    'path_displayconfig',
    'displayconfig',
    `${window.location.protocol}//${window.location.hostname}/displayconfig/`,
    data => initScreens(Immutable.fromJS(data)),
    () => initScreens(DEFAULT_SCREEN_CONFIG),
    body,
);