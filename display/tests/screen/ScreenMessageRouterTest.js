import {ScreenMessageRouter} from 'src/screen/ScreenMessageRouter';

const MockScreenMessageRouter = ()=>{
    let screens = [];

    class MockScreen {
        constructor(id, element, kwargs) {
            expect(typeof(id)).toBe('string')
            //expect(element.).toBe('string')  // TODO: assert html element
            //expect(typeof(kwargs)).toBe('object')  // unused
            const mockScreen = jasmine.createSpyObj('Screen', ['onMessage']);
            screens.push(mockScreen);
            return mockScreen;
        }
    }

    return {
        mockScreenClass: MockScreen,
        screens: screens,
    };
};

describe('ScreenMessageRouter', function() {
    const mockScreenMessageRouter = MockScreenMessageRouter();
    const screens = ()=>mockScreenMessageRouter.screens;

    let mockSubscriptionSocket;
    let screenMessageRouter;
    let element;

    function setupBaseScreens() {
        screenMessageRouter.bindScreen('testid1', element);
        expect(mockSubscriptionSocket.sendSubscriptions).toHaveBeenCalledWith(new Set(['testid1']));
        expect(screens().length).toBe(1);
        screenMessageRouter.bindScreen('testid2', element, ['test_me_too']);
        expect(mockSubscriptionSocket.sendSubscriptions).toHaveBeenCalledWith(new Set(['testid1', 'testid2', 'test_me_too']));
        expect(screens().length).toBe(2);
    };

    beforeEach(function() {
        element = jasmine.createSpyObj('HTMLElement', ['methodName_ooo']);
        mockSubscriptionSocket = jasmine.createSpyObj('SubscriptionSocketReconnect', ['onMessage', 'sendSubscriptions', 'addOnMessageListener']);
        mockSubscriptionSocket.addOnMessageListener = (listener)=>{mockSubscriptionSocket._test_listener = listener;}
        mockSubscriptionSocket.onMessage = (msg)=>{mockSubscriptionSocket._test_listener(msg);}
        screenMessageRouter = new ScreenMessageRouter(mockSubscriptionSocket, {ScreenClass: mockScreenMessageRouter.mockScreenClass});
        setupBaseScreens();
    });

    afterEach(function() {
        element = undefined;
        screenMessageRouter = undefined;
        mockSubscriptionSocket = undefined;
        screens().splice(0, screens().length);  // es6 dosnt have a .clear() or .empty() method.
    });

    it('Should update subscriptions when binding screens',()=>{
    });

    it('Should route a single message destined to a single screen id',()=>{
        const msg1 = {deviceid: 'testid1', a: 1};
        mockSubscriptionSocket.onMessage(msg1);
        expect(screens()[0].onMessage).toHaveBeenCalledWith(msg1);
        expect(screens()[1].onMessage).not.toHaveBeenCalledWith(msg1);
    });

    it('Should route single message to a single screen scubscription',()=>{
        const msg2 = {deviceid: 'test_me_too', b: 2};
        mockSubscriptionSocket.onMessage(msg2);
        expect(screens()[0].onMessage).not.toHaveBeenCalledWith(msg2);
        expect(screens()[1].onMessage).toHaveBeenCalledWith(msg2);
    });

    it('Should route single message to multiple subscribed screens',()=>{
        const msg3 = {deviceid: 'test_me_three', c: 3};
        screenMessageRouter.bindScreen('testid3', element, ['test_me_three']);
        mockSubscriptionSocket.onMessage(msg3);
        expect(screens()[0].onMessage).not.toHaveBeenCalledWith(msg3);
        expect(screens()[1].onMessage).not.toHaveBeenCalledWith(msg3);
        expect(screens()[2].onMessage).toHaveBeenCalledWith(msg3);
    });

    it('Should route messages for "all" to all screens', ()=>{
        const msg4 = {deviceid: 'all', d: 4};
        mockSubscriptionSocket.onMessage(msg4);
        expect(screens()[0].onMessage).toHaveBeenCalledWith(msg4);
        expect(screens()[1].onMessage).toHaveBeenCalledWith(msg4);
    });

});