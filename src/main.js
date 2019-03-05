import Vue from 'vue'

import App from './App.vue'


import 'bootstrap/dist/css/bootstrap.css'

const vm = new Vue({
  el: '#app',
  render: h => h(App)
})