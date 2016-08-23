import 'core-js/fn/object/assign';


export default class AbstractSocketReconnect {

    constructor(kwargs) {
        Object.assign(this, {
            WebSocket: WebSocket,
            hostname: location.hostname,
            port: 9873,
            disconnected_retry_interval_seconds: 5,
            console: console
        }, kwargs);
        this._connect();
    }

    _connect() {
        const socket = new this.WebSocket('ws://'+this.hostname+':'+this.port+'/');
        let retry_interval = null;

        socket.onopen = () => {
            if (retry_interval) {
                clearInterval(retry_interval);
                retry_interval = null;
            }
            this._send = (msg) => {
                return socket.send(this.encodeMessage(msg));
            };
            this.onConnected();
        };
        socket.onclose = () => {
            if (!retry_interval) {
                retry_interval = setInterval(this._connect(), this.disconnected_retry_interval_seconds * 1000);
            }
            this._send = this.send_while_disconnected;
            this.onDisconnected();
        };
        socket.onmessage = (msg) => {
            this.onMessage(msg.data);
        };
    }

    send(msg) {
        this._send(msg);
    }
    _send(msg) {
        this.console.error('Send Failed: Socket has not been initalised', msg);
    }
    _send_while_disconnected(msg) {
        this.console.warn('Send Failed: Currently disconnected', msg);
    }

    encodeMessage(msg) {
        return msg+'\n';
    }
    decodeMessage(msg) {
        return msg.split('\n').filter((x)=>{return x});
    }

    // Abstract Methods -------
    onMessage(msg) {
        for (let m of this.decodeMessage(msg)) {
            this.onMessage(m);
        }
    }
    onConnected() {this.console.log('onConnected');}
    onDisconnected() {this.console.log('OnDisconnected');}
}

export default class AbstractJsonSocketReconnect extends AbstractSocketReconnect {
    send(msg) {
        this.send(JSON.stringify(msg));
    }
    onMessage(msg) {
        this.onMessage(JSON.parse(msg));
    }
}

//SubscriptionSocketReconnect

//export default {
//    SocketReconnect
//};