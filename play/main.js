import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false;
//服务器地址
Vue.prototype.serverUrl = 'http://127.0.0.1:3001';

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
