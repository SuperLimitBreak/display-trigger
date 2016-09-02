import {DefaultDict} from 'pycollections';
import {Screen} from './screen';


export class ScreenManager {
    /*
    Reference/Create/Manage all screens and route incoming messages to the correct screens.
    Screens should have no knowlge of their subscriptions or network routing
    */
    
    constructor(subscription_socket) {
        this.console = console;
        this.screens = new Map();
        this.subscription_screen_id_lookup = new DefaultDict(()=>new Set());
        this.subscription_socket = subscription_socket;
        this.subscription_socket.onMessage = (msgs) => this.onMessage(msgs);
    }
    
    bindScreen(id, element, subscriptions=[]) {
        this.console.assert(!this.screens.hasOwnProperty(id), 'Screen id already exists');
        this.screens.set(id, new Screen(element));
        for (let subscription of new Set([...subscriptions, ...[id]])) {
            this.subscription_screen_id_lookup.get(subscription).add(id);
        }
        this.subscription_socket.sendSubscriptions(this.allSubscriptions);
    }
    
    get allSubscriptions() {
        const screenManager = this;
        function* allSubscriptionsGenerator(){
            for (let lookup_set of screenManager.subscription_screen_id_lookup.values()) {
                yield* lookup_set;
            }
        }
        return new Set(allSubscriptionsGenerator());
    }
    
    // Route message to the subscribed screens
    onMessage(msg) {
        for (let id of this.subscription_screen_id_lookup.get(msg.deviceid, [])) {
            this.screens.get(id).onMessage(msg);
        }
    }
}
