import 'core-js/fn/object/assign';

import {ScreenMessageRouter} from './screen/ScreenMessageRouter';
import {SubscriptionSocketReconnect} from './socket/websocket';

require('normalize.css/normalize.css');
require('./styles/main.scss');

const screenMessageRouter = new ScreenMessageRouter(
    new SubscriptionSocketReconnect()
);

const body = document.getElementsByTagName('body').item(0);
const screen_test = document.createElement('div');
body.appendChild(screen_test);

screenMessageRouter.bindScreen('main', screen_test);
//screenManager.bindScreen('test', null);

  //{subscriptions:['main', 'all']}
