import Vue from 'vue'
import App from './App'
/*import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
    // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key *!/
    ak: 'gNaq7XWioXEErNdLyFdddbxksLyNYKQb'
});*/

Vue.config.productionTip = false;
Vue.prototype.$mayKey = 'MwbFjzhU3fmsw8Wc3UNShYEZ5g8XnrDx';

App.mpType = 'app';

const app = new Vue({
    ...App
});
app.$mount();
