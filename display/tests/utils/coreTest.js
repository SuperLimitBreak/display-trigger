import {zip, range} from 'src/utils/es6_core';


describe('Core', function() {

    it('Should generate a linear range', ()=>{
        const array_range = Array.from(range(3));
        expect(JSON.stringify(array_range)).toBe(JSON.stringify([0,1,2]));
    });

    it('Should zip two iterables',()=>{
        const zipped = Array.from(zip([1,2,3],[4,5,6]));
        expect(JSON.stringify(zipped)).toBe(JSON.stringify([[1,4],[2,5],[3,6]]));
    });

});