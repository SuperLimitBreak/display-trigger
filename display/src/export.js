import {ScreenMessageRouter} from './screen/ScreenMessageRouter';
import {SubscriptionSocketReconnect} from './socket/websocket';
import {getUrlParameter, static_url} from './utils/utils';


module.exports = {
    ScreenMessageRouter,
    SubscriptionSocketReconnect,
    utils: {
        getUrlParameter,
    },
};
