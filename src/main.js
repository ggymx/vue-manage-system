import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import Vuex from 'vuex';
import store from './store/index';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
//引用animate动画库
import animate from 'animate.css'

//excel文件导出插件
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

//全局注册使用（所有组件都可以直接使用）
Vue.use(animate);
Vue.config.productionTip = false
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});

//axios不支持use方法，使用时this.$axios???不能使用？？？
Vue.prototype.$axios = axios;
Vue.prototype.$fileSaver = FileSaver;
Vue.prototype.$xlsx = XLSX;

const i18n = new VueI18n({
    locale: 'zh',
    messages
})

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    //从本地存储中获取username
    const role = sessionStorage.getItem('token');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
})


new Vue({   
    router,
    i18n,
    store,
    render: h => h(App)
}).$mount('#app')