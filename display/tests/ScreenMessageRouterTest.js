import {ScreenManager} from 'src/screen/ScreenManager';

const MockScreenManager = ()=>{
    
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
    const screens = ()=>MockScreenManager.screens;
    
    let screenMessageRouter;
    let mockSubscriptionSocket;
    
    beforeEach(function() {
        screens().
        mockSubscriptionSocket = jasmine.createSpyObj('SubscriptionSocketReconnect', ['onMessage', 'sendSubscriptions']);
        screenMessageRouter = new ScreenManager(mockSubscriptionSocket, {ScreenClass: MockScreenManager.mockScreenClass});
    });

    afterEach(function() {
        screenManager = undefined;
        mockSubscriptionSocket = undefined;
    });

    it('Should update subscriptions when binding screens',()=>{
        
    });
    
    it('Should route messages to the correct screens',()=>{
        
    });

});