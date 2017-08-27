import 'core-js/fn/object/assign';

import {ScreenMessageRouter} from './screen/ScreenMessageRouter';
import {SubscriptionSocketReconnect} from './socket/websocket';
import {getUrlParameter, staticUrl} from './utils/utils';

const Immutable = require('immutable');

require('normalize.css/normalize.css');
require('./styles/main.scss');

import 'index.html';

const body = document.getElementsByTagName('body').item(0);

const DEFAULT_SCREEN_CONFIG = Immutable.fromJS({
    'main': {
        'id': 'default_screen',
        'classList': undefined,
        'style': undefined,
        'subscriptions': [],
    },
});

const screenMessageRouter = new ScreenMessageRouter(
    new SubscriptionSocketReconnect()
);

function initScreens(config) {
    for (let [screen_name, screen_data] of config) {
        const id = screen_data.get('id');
        let element = document.getElementById(id);
        if (!element) {
            element = document.createElement('div');
            element.id = id;
            body.appendChild(element);
        }
        //element.classList.concat(screen_data.get('classList'));
        element.style = screen_data.get('style');
        screenMessageRouter.bindScreen(screen_name, element, Array.from(screen_data.get('subscriptions')));
    }
}

const config_url = staticUrl(`/display_configs/${getUrlParameter('display_config') || 'single'}.json`);
fetch(config_url).then(response => {
    return response.json();
}).then(data => {
    initScreens(Immutable.fromJS(data));
}).catch(error => {
    console.error(`Unable to load ${config_url} for display_config. Falling back to default`, error);
    initScreens(DEFAULT_SCREEN_CONFIG);
});

