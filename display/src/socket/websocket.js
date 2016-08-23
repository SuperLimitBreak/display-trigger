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

        this._send = (msg) => {
            return socket.send(this.encodeMessage(msg));
        };

        socket.onopen = () => {
            if (retry_interval) {
                clearInterval(retry_interval);
                retry_interval = null;
            }
            this.onConnected();
        };
        socket.onclose = () => {
            this._send = this.send_while_disconnected;
            if (!retry_interval) {
                retry_interval = setInterval(this._connect(), this.disconnected_retry_interval_seconds * 1000);
            }
            this.onDisconnected();
        };
        socket.onmessage = (msg) => {this.onMessage(msg.data);};
    }

    send(msg) {
        this._send(msg);
    }
    _send(msg) {
        this.console.error('Socket has not been initalised', msg);
    }
    _send_while_disconnected(msg) {
        this.console.warn('Failed to send message: Currently disconnected', msg);
    }

    encodeMessage(msg) {
        return msg+'\n';
    }
    decodeMessage(msg) {
        return msg.split('\n').filter((x)=>{return x});
    }

    onMessage(msg) {
        for (let m of this.decodeMessage(msg)) {
            super.onMessgae(m);
        }
    }

    onConnected() {
        super.onConnected();
    }
    onDisconnected() {
        super.onDisconnected();
        //this.console.log('onConnected');
        //this.console.log('onDisconected');
    }
}

//JsonSocketReconnect

//SubscriptionSocketReconnect

//export default {
//    SocketReconnect
//};