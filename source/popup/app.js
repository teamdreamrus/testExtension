import Vue from 'vue';
import App from './components/app.vue';

class Popup {
  constructor() {
    this.popup = new Vue({
      el: '#popup',
      render: h => h(App),
    });
  }
}

window.popup = new Popup();
