import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { auth } from './services/firebase'
import { getUserByEmail } from './services/firestore/FirebaseUsers'
import { getRoleById } from './services/firestore/FirebaseRoles'
import { getStoreByName } from './services/firestore/FirebaseStores'

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
    }).$mount('#app');
    if(user !== null)
    {
      getUserByEmail(user.email).then(snap => {
        snap.forEach(doc => {
            store.state.userEmail = doc.data().email;
            store.state.userName = doc.data().name;
            store.state.userLastname = doc.data().lastname;
            store.state.userStore = doc.data().store;
            store.state.userRole = doc.data().role;
            store.state.userIdRole = doc.data().idRole;
            getRoleById(doc.data().idRole).then(doc => {
              store.state.salesGuard = doc.data().sales; 
            });
            getStoreByName(doc.data().store).then( snap => 
            {
              snap.docs.forEach( doc => 
              {
                store.state.storeDirection = doc.data().direction;
              });
            });
        });
      });
    }
  }
})

//to here, below is the original code

// new Vue({
//   router,
//   store,
//   vuetify,
//   render: h => h(App)
// }).$mount('#app')
