/* global HOST_STATIC_PORT */

import {static_url} from 'src/utils/utils';


describe('Utils - static_url', function() {

    it('Should attach the static hostname to relative paths',()=>{
        expect(static_url('/assets/test.mp4')).toBe(`http://localhost:${HOST_STATIC_PORT}/assets/test.mp4`);
    });

    it('Should pass through absolute urls',()=>{
        expect(static_url('http://video.com/test.mp4')).toBe('http://video.com/test.mp4');
    });

});