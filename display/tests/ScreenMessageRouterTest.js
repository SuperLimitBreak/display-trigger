import {ScreenMessageRouter} from 'src/screen/ScreenMessageRouter';

const MockScreenMessageRouter = ()=>{
    let screens = [];
    
    class MockScreen {
        constructor() {
            mockScreen = jasmine.createSpyObj('Screen', ['onMessage']);
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
    const screens = ()=>MockScreenMessageRouter.screens;
    
    let mockSubscriptionSocket;
    let screenMessageRouter;
    
    beforeEach(function() {
        mockSubscriptionSocket = jasmine.createSpyObj('SubscriptionSocketReconnect', ['onMessage', 'sendSubscriptions']);
        screenMessageRouter = new ScreenMessageRouter(mockSubscriptionSocket, {ScreenClass: MockScreenMessageRouter.mockScreenClass});
    });

    afterEach(function() {
        screenManager = undefined;
        mockSubscriptionSocket = undefined;
        screens().splice(0, screens().length);  // es6 dosnt have a .clear() or .empty() method.
    });

    it('Should update subscriptions when binding screens',()=>{
        const element = jasmine.createSpyObj('HTMLElement', ['methodName_ooo']);
        screenMessageRouter.bindScreen('testid1', element);
        expect(mockSubscriptionSocket.sendSubscriptions).toHaveBeenCalledWith(new Set(['testid1']));
        expect(screens().length).toBe(1);
        screenMessageRouter.bindScreen('testid2', element, ['test_me_too']);
        expect(mockSubscriptionSocket.sendSubscriptions).toHaveBeenCalledWith(new Set(['testid1', 'testid2', 'test_me_too']));
        expect(screens().length).toBe(2);

        it('Should route a single message destined to a single screen id',()=>{
            const msg1 = {deviceid: 'testid1', a: 1};
            mockSubscriptionSocket.onMessage(msg1);
            expect(screens()[0].onMessage).toHaveBeenCalledWith(msg1);
            expect(screens()[1].onMessage).not.toHaveBeenCalledWith(msg1);
        });
        
        it('Should route single message to a single screen scubscription',()=>{
            const msg2 = {deviceid: 'test_me_too', b: 2};
            mockSubscriptionSocket.onMessage(msg2);
            expect(screens()[0].onMessage).toHaveBeenCalledWith(msg2);
            expect(screens()[1].onMessage).toHaveBeenCalledWith(msg2);
        });

        it('Should route single message to multiple subscribed screens',()=>{
            const msg3 = {deviceid: 'test_me_too', c: 3};
            screenMessageRouter.bindScreen('testid3', element, ['test_me_too']);
            mockSubscriptionSocket.onMessage(msg3);
            expect(screens()[0].onMessage).not.toHaveBeenCalledWith(msg3);
            expect(screens()[1].onMessage).toHaveBeenCalledWith(msg3);
            expect(screens()[2].onMessage).toHaveBeenCalledWith(msg3);
        });
        
    });

});