import DefaultDict from 'pycollections';
import Screen from './screen';


export class ScreenManager {
    constructor() {
        this.screens = {};
        this.subscription_screen_id_lookup = new DefaultDict([].constructor);
    }
    
    bindScreen(element, id, subscriptions=[]) {
        // TODO: assert id not in this.screens
        this.screens[id] = new Screen(element);
        subscriptions = new Set([...subscriptions, ...[id]]);  // Screens always subscribe to it's own id name
        for (let subscription of subscriptions) {
            this.subscription_screen_id_lookup[subscription].push(id);
        }
    }

    // Route a layload to the various screens
    onMessage(payload) {
        for (let message of payload) {
            for (let id of this.subscription_screen_id_lookup[message.deviceid]) {
                this.screens[id].onMessage(message);
            }
        }
    }
}
