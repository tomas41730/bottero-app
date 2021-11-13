import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { auth } from './services/firebase'

Vue.config.productionTip = false

//new from here
let app;
auth.onAuthStateChanged( user => {
  console.log(user);
  if(!app)
  {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})
//to here, below is the original code

// new Vue({
//   router,
//   store,
//   vuetify,
//   render: h => h(App)
// }).$mount('#app')
