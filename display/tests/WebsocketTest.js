import {SocketReconnect, JsonSocketReconnect, SubscriptionSocketReconnect} from 'src/socket/websocket';


describe('SocketReconnect', function() {

    let mockSocket;
    class MockWebSocket {
        constructor() {
            mockSocket = jasmine.createSpyObj('WebSocket', ['send', 'onopen', 'onclose', 'onmessage']);
            return mockSocket;
        }
    }

    beforeEach(function() {
        //mockWebSocket = jasmine.createSpyObj('WebSocket', ['send', 'onopen', 'onclose', 'onmessage']);
    });
    
    it('should connect on creation',()=>{
        let socket = new SocketReconnect({
            WebSocket: MockWebSocket,
        });
        expect(mockSocket).not.toBe(undefined);
        spyOn(socket, 'onConnected').and.callThrough();
        spyOn(socket, 'onDisconnected').and.callThrough();
        expect(socket.onConnected).not.toHaveBeenCalled();
        mockSocket.onopen();
        expect(socket.onConnected).toHaveBeenCalled();
    });
});
