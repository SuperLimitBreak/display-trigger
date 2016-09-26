import {Screen} from 'src/screen/Screen';


describe('Screen', function() {
    let mockElement;
    let screen;
    let mockLayer1;
    let mockLayer2;
    
    beforeEach(function() {
        class mockLayer1Class {
            constructor() {
                expect(mockLayer1).not.toBeDefined();
                mockLayer1 = jasmine.createSpyObj('MockLayer1Class', ['thing1']);
                return mockLayer1;
            }
        }
        mockLayer1Class.className = 'MockLayer1';
        class mockLayer2Class {
            constructor() {
                expect(mockLayer2).not.toBeDefined();
                mockLayer2 = jasmine.createSpyObj('MockLayer2Class', ['thing2']);
                return mockLayer2;
            }
        }
        mockLayer2Class.className = 'MockLayer2';
        
        mockElement = jasmine.createSpyObj('HTMLElement', ['appendChild', 'classList']);
        mockElement.classList = jasmine.createSpyObj('HTMLElement', ['add']);
        screen = new Screen(mockElement, {
            documentCreateElement: ()=>{},
            screenClassName: 'screen_test',
            layerClasss: [mockLayer1Class, mockLayer2Class],
        });
    });

    afterEach(function() {
        mockElement = undefined;
        screen = undefined;
        mockLayer1 = undefined;
        mockLayer2 = undefined;
    });
    
    it('Should have created layers on construction',()=>{
        expect(mockLayer1).toBeDefined();
        expect(mockLayer2).toBeDefined();
    });

});