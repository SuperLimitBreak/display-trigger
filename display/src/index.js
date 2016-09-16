import 'core-js/fn/object/assign';

import {ScreenMessageRouter} from './screen/ScreenMessageRouter';
import {SubscriptionSocketReconnect} from './socket/websocket';


const screenMessageRouter = new ScreenMessageRouter(
    new SubscriptionSocketReconnect()
);

screenMessageRouter.bindScreen('main', null);
//screenManager.bindScreen('test', null);

  //{subscriptions:['main', 'all']}
