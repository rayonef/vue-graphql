import Vue from 'vue'
import './plugins/vuetify'
import { apolloProvider } from './plugins/apollo';
import App from './App.vue'
import router from './router'
import store from './store'

import FormAlert from './components/Shared/FormAlert';
Vue.component('form-alert', FormAlert);

Vue.config.productionTip = false

new Vue({
  apolloProvider,
  router,
  store,
  render: h => h(App),
  created() {
    this.$store.dispatch('getCurrentUser');
  }
}).$mount('#app')
