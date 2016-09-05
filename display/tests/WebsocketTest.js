import {SocketReconnect, JsonSocketReconnect, SubscriptionSocketReconnect} from 'src/socket/websocket';


describe('SocketReconnect', function() {

    let socket;

    let mockSocket;
    class MockWebSocket {
        constructor() {
            expect(mockSocket).toBe(undefined);  // We only ever want one socket connected under test conditions
            mockSocket = jasmine.createSpyObj('WebSocket', ['send', 'onopen', 'onclose', 'onmessage']);
            return mockSocket;
        }
    }

    beforeEach(function() {
        socket = new SocketReconnect({
            WebSocket: MockWebSocket,
        });
        expect(mockSocket).not.toBe(undefined);
        spyOn(socket, 'onConnected').and.callThrough();
        spyOn(socket, 'onDisconnected').and.callThrough();
    });
    
    it('Should called onConnected on creation',()=>{
        expect(socket.onConnected).not.toHaveBeenCalled();
        mockSocket.onopen();
        expect(socket.onConnected).toHaveBeenCalled();
    });
});
