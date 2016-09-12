import {ScreenManager} from 'src/screen/ScreenManager';


describe('ScreenManager', function() {
    
    let screenManager;
    let mockSubscriptionSocket;
    
    beforeEach(function() {
        mockSubscriptionSocket = jasmine.createSpyObj('SubscriptionSocketReconnect', ['onMessage', 'sendSubscriptions']);
        screenManager = new ScreenManager(mockSubscriptionSocket);
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