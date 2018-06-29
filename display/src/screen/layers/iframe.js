import {get_func} from 'calaldees_libs/es6/reflection';

require('../../styles/layers/iframe.scss');


export class iframe {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            documentCreateElement: ()=>document.createElement('iframe'),
            console: console,
        }, kwargs);
        this._iframe_element = undefined;
    }
    
    // Get/Remove --------------------------------------------------------------
    
    get iframe() {
        if (!this._iframe_element) {
            this._iframe_element = this.documentCreateElement();
            this._iframe_element.scrolling = false;
            this.element.appendChild(this._iframe_element);
        }
        return this._iframe_element;
    }

    clear() {return this.empty();}  // TODO: remove alias?
    empty() {
        if (this._iframe_element) {
            this._iframe_element.remove();
            this._iframe_element = undefined;
        }
    }
    
    // Public -----------------------------------------------------------------
    
    init(msg) {return this.create(msg);}  // Alias for backwards compatibility TODO: Remove?
    create(msg) {
        this.iframe.src = msg.src;
    }
    
    function_call(data) {
        const iframe_window = this.iframe.contentWindow;
        try {
            // Attempt direct javascript call to iframe
            get_func(data.func_iframe, iframe_window)(data);
        }
        catch (error) {
            if (error.name == 'SecurityError') {
                // Fallback to html5 postMessage()
                iframe_window.postMessage(JSON.stringify(data), data.target_domain || '*'); //iframe_element.src  //window.location.origin
            }
            else {
                this.console.error(error);
            }
        }
    }

}
iframe.className = 'iframe';