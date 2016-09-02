import {DefaultDict} from 'pycollections';
import {Screen} from './screen';


export class ScreenManager {
    /*
    Reference/Create/Manage all screens and route incoming messages to the correct screens.
    */
    
    constructor(subscription_socket) {
        this.console = console;
        this.screens = new Map();
        this.subscription_screen_id_lookup = new DefaultDict(()=>new Set());
        this.subscription_socket = subscription_socket;
        this.subscription_socket.onMessage = (msgs) => this.onMessage(msgs);
    }
    
    bindScreen(id, element, subscriptions=[]) {
        this.console.log('bindScreen');
        this.console.assert(!this.screens.hasOwnProperty(id), 'Screen id already exists');
        this.screens.set(id, new Screen(element));
        for (let subscription of new Set([...subscriptions, ...[id]])) {
            this.subscription_screen_id_lookup.get(subscription).add(id);
        }
        this.subscription_socket.sendSubscriptions(this.allSubscriptions);
    }
    
    get allSubscriptions() {
        this.console.log('allSub');
        function* allSubscriptionsGenerator(){
            this.console.log('inside generator', this);
            yield* this.subscription_screen_id_lookup.values();
        }
        return new Set(allSubscriptionsGenerator());
    }
    
    // Route a layload to the various screens
    onMessage(msg) {
        this.console.log('ScreenManager.onMessage', msg, this.subscription_screen_id_lookup.keys());
        for (let id of this.subscription_screen_id_lookup.get(msg.deviceid, [])) {
            this.console.log('Screen.onMessage', id, this.screens.get(id));
            this.screens.get(id).onMessage(msg);
        }
    }
}
