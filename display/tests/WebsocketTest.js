import {SocketReconnect, JsonSocketReconnect, SubscriptionSocketReconnect} from 'src/socket/websocket';


describe('SocketReconnect', function() {

    let socket;

    let mockSocket;
    class MockWebSocket {
        constructor() {
            //expect(mockSocket).toBe(undefined);  // We only ever want one socket connected under test conditions
            mockSocket = jasmine.createSpyObj('WebSocket', ['send', 'onopen', 'onclose', 'onmessage']);
            return mockSocket;
        }
    }

    beforeEach(function() {
        expect(mockSocket).toBe(undefined);
        socket = new SocketReconnect({
            WebSocket: MockWebSocket,
        });
        expect(mockSocket).not.toBe(undefined);
        spyOn(socket, 'onConnected');
        spyOn(socket, 'onDisconnected');
        spyOn(socket, 'onMessage');
        spyOn(socket, 'decodeMessages').and.callThrough();
        spyOn(socket, 'encodeMessages').and.callThrough();
    });

    afterEach(function() {
        socket = undefined;
        mockSocket = undefined;
    });

    it('Should call onConnected on creation/connection',()=>{
        expect(socket.onConnected).not.toHaveBeenCalled();
        mockSocket.onopen();
        expect(socket.onConnected).toHaveBeenCalled();
    });
    
    it('Should call onMessage when a message is recived/decoded',()=>{
        mockSocket.onopen();
        expect(socket.onMessage).not.toHaveBeenCalled();
        mockSocket.onmessage({data: 'Hello World\n'});
        expect(socket.decodeMessages).toHaveBeenCalled();
        expect(socket.onMessage).toHaveBeenCalledWith('Hello World');
    });

    it('Should call send when a message is sent (but not when disconnected)',()=>{
        expect(mockSocket.send).not.toHaveBeenCalled();
        socket.send('Hello World');
        expect(mockSocket.send).not.toHaveBeenCalled();
        mockSocket.onopen();
        socket.send('Hello World');
        expect(mockSocket.send).toHaveBeenCalledWith('Hello World\n');
        mockSocket.onclose();
        socket.send('Hello Again');
        expect(mockSocket.send).not.toHaveBeenCalled();
    });

});
