import Vue from 'vue';
import App from './components/app.vue';

class Popup {
  constructor(data) {
    this.popup = new Vue({
      el: '#popup',
      render: h => h(App, { props: { data: data } }),
    });
  }
}
chrome.storage.local.get({ data: [] }, ({ data }) => {
  window.popup = new Popup(data);
});
