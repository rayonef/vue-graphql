import Vue from 'vue'
import './plugins/vuetify'
import { apolloProvider } from './plugins/apollo';
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment';

import FormAlert from './components/Shared/FormAlert';
Vue.component('form-alert', FormAlert);

Vue.filter('prettyDate', (date) => moment(new Date(date)).format('ll'));
Vue.filter('fromNow', (time) => moment(new Date(time)).fromNow());

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
