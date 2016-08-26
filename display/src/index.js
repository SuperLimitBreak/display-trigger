import 'core-js/fn/object/assign';

//import ScreenManager from './screen/ScreenManager';
import {SubscriptionSocketReconnect} from './socket/websocket';


new SubscriptionSocketReconnect({subscriptions:['main', 'all']});
