import 'core-js/fn/object/assign';

//import ScreenManager from './screen/ScreenManager';
import AbstractJsonSocketReconnect from './socket/websocket';

class SocketTest extends AbstractJsonSocketReconnect {
    onMessage(msg) {
        this.console.log('JSON onMessage', msg);
    }
    onConnected() {this.console.log('JSON onConnected');}
    onDisconnected() {this.console.log('JSON OnDisconnected');}
}
new SocketTest();
