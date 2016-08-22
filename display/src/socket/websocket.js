import 'core-js/fn/object/assign';


class SocketReconnect {

    constructor(kwargs) {
        assign(this, {
            WebSocket: WebSocket,
            hostname: location.hostname,
            port: 9873,
            disconnected_retry_interval: 5,
        }, kwargs);
    }
    
    _connect() {
        let socket = new this.WebSocket("ws://"+this.hostname+":"+this.port+"/");
        let retry_interval = null;
        
        this._send = (msg) => {
            return socket.send(this.encodeMessage(msg));
        };
        
		socket.onopen = function() {
			//console.debug(options.title+": onopen");
			if (retry_interval) {
				clearInterval(retry_interval);
				retry_interval = null;
			}
			this.onConnected();
		};
		socket.onclose  = function() {
			//console.debug(options.title+": onclose");
			socket = null;
			this._send = this.send_while_disconnected;
			if (!retry_interval) {
				retry_interval = setInterval(this._connect(), this.disconnected_retry_interval * 1000);
			}
			this.onDisconnected();
		};
		socket.onmessage = this.onMessage;    
    }
    
    send(msg) {
        this._send(msg);
    }
    
    _send_while_disconnected(msg) {
        console.warn('Failed to send message: Currently disconnected', msg);
    }
        
    encodeMessage(msg) {
        return msg+'\n';
    }
    
    decodeMessage(msg) {
        //return _.filter(msg.data.split('\n'), function(element){return element;}), function(element, index, list)))
        return [];
    }
    
    onMessage(msg) {
        for (let m of this.decodeMessage(msg)) {
            super.onMessgae(msg);
        }
    }
    
    onConnected() {
        super.onConnected();
    }
    
    onDisconnected() {
        super.onDisconnected();
    }
}

//JsonSocketReconnect

//SubscriptionSocketReconnect
