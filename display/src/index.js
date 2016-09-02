import 'core-js/fn/object/assign';

import {ScreenManager} from './screen/ScreenManager';
import {SubscriptionSocketReconnect} from './socket/websocket';


const screenManager = new ScreenManager(
    new SubscriptionSocketReconnect()
);

screenManager.bindScreen('main', null);
screenManager.bindScreen('test', null);

  //{subscriptions:['main', 'all']}
