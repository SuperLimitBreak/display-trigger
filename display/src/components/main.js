require('normalize.css/normalize.css');
require('styles/main.scss');


class App {
    constructor(element) {
        this.element = element;
        this.element.classList.add('item');
        this.element.innerText = 'test';
        //console.log('App constructor');
    }
}

export default {
    App: new App(document.getElementById('app'))
};
