import DefaultDict from 'pycollections';
import Screen from './screen';
import {SubscriptionSocketReconnect} from './socket/websocket';

export class ScreenManager {
    // Collect screens and route incoming messages to the correct screens.
    constructor() {
        this.screens = {};
        this.subscription_screen_id_lookup = new DefaultDict(Set);  //[].constructor
        this.subscription_socket = new SubscriptionSocketReconnect();
        this.subscription_socket.onMessage = this.onMessage;
    }
    
    bindScreen(id, element, subscriptions=[]) {
        // TODO: assert id not in this.screens
        this.screens[id] = new Screen(element);
        for (let subscription of new Set([...subscriptions, ...[id]])) {
            this.subscription_screen_id_lookup[subscription].add(id);
        }
        this.subscription_socket.sendSubscriptions(this.subscriptions);
    }
    
    get subscriptions() {
        return function* (){
            yield* this.subscription_screen_id_lookup.values();
        }();
    }
    
    // Route a layload to the various screens
    onMessage(msg) {
        for (let id of this.subscription_screen_id_lookup[msg.deviceid]) {
            this.screens[id].onMessage(msg);
        }
    }
}
