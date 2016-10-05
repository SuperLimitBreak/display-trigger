import 'core-js/fn/object/assign';

import {ScreenMessageRouter} from './screen/ScreenMessageRouter';
import {SubscriptionSocketReconnect} from './socket/websocket';
import {getUrlParameter, static_url} from './utils/utils';

const Immutable = require('immutable');

require('normalize.css/normalize.css');
require('./styles/main.scss');


const body = document.getElementsByTagName('body').item(0);

const DEFAULT_SCREEN_CONFIG = new Immutable.Map({
    'main': new Immutable.Map({
        'id': 'default_screen',
        'classList': undefined,
        'style': undefined,
        'subscriptions': [],
    }),
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
        screenMessageRouter.bindScreen(screen_name, element, screen_data.get('subscritpions'));
    }
}
  
const config_url = static_url(`/config/${getUrlParameter('config') || 'default'}.json`);
fetch(config_url).then(response => {
    initScreens(Immutable.Map(response.data));
}).catch(error => {
    initScreens(DEFAULT_SCREEN_CONFIG);
});

