import 'core-js/fn/object/assign';

//import ScreenManager from './screen/ScreenManager';
import AbstractSocketReconnect from './socket/websocket';

class SocketReconnect extends AbstractSocketReconnect {
    onMessage(msg) {
        this.console.log('onMessage', msg);
    }
    onConnected() {
        this.console.log('onConnected');
    }
    onDisconnected() {
        this.console.log('onDisconected');
    }
}
new SocketReconnect();

//console.log(App);
//console.log("poo");

