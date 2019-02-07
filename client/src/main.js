import Vue from 'vue'
import './plugins/vuetify'
import { apolloProvider } from './plugins/apollo';
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  apolloProvider,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
