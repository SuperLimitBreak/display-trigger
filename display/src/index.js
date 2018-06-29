import 'core-js/fn/object/assign';

import {ScreenMessageRouter} from './screen/ScreenMessageRouter';
import {SubscriptionSocketReconnect} from './socket/websocket';  // TODO: import this from es6_libs

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



const screenMessageRouter = new ScreenMessageRouter(
    new SubscriptionSocketReconnect()
);

function initScreens(screenConfig) {
    const config = screenConfig.get('_config', Immutable.fromJS({}));
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


// TODO: import this from es6_libs
function queryStringListOrInit(
    QUERY_STRING_KEY_index,  // query string key name to override index path (if omitted will take DEFAULT_PATH_index)
    QUERY_STRING_KEY_file, // query string key name for data file to load
    DEFAULT_PATH_index,  // If no index path is given in query string, default to this value
    initFunc,  // init function passed file data
    initFuncDefault,  // If data file cannot be loaded
    hostElement,  // The HTML Element to appendChild list
) {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has(QUERY_STRING_KEY_file)) {
        const PATH = urlParams.get(QUERY_STRING_KEY_file);
        fetch(PATH)
            .then(response => response.json())
            .then(initFunc)
            .catch(error => {
                console.error(`Unable to load ${PATH} for display_config. Falling back to default`, error);
                initFuncDefault();
            })
        ;
    } else {
        const PATH = urlParams.get(QUERY_STRING_KEY_index) || DEFAULT_PATH_index;
        function renderList(data) {
            // data is JSON_INDEX from nginx file listing
            const files = data.map(i => i.name).filter(i => i.indexOf('.json') >= 0);
            const elementContainer = document.createElement('div');
            for (const file of files) {
                const _urlParams = new URLSearchParams(urlParams);
                _urlParams.append(QUERY_STRING_KEY_file, PATH + file);
                elementContainer.insertAdjacentHTML('beforeend', `<li><a href="${window.location.pathname}?${_urlParams.toString()}">${file}</a></li>`);
            }
            hostElement.appendChild(elementContainer);
        }
        console.log(`Loading ${PATH}. You can optionally override this path with querystring param ${QUERY_STRING_KEY_index}`);
        fetch(PATH)
            .then(response => response.json())
            .then(data => renderList(data))
            .catch(error => console.error(`Failed to list files from ${PATH}`, error))
        ;
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