import Vue from 'vue'
import App from './App.vue'
import 'bulma/css/bulma.css'
import router from './router'

Vue.config.productionTip = false


new Vue({
    router, // add router here
    render: h => h(App),
}).$mount('#app')