import Vue from 'vue'
import Vuex from 'vuex'
import { getNotifications } from '../services/firestore/FirebaseNotifications'
import { getUserByEmail } from '../services/firestore/FirebaseUsers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logoBottero: 'https://firebasestorage.googleapis.com/v0/b/bottero-app-3a25c.appspot.com/o/utilities%2Flogo.png?alt=media&token=3104e203-0e98-4354-86d0-9aa05b5a290e',
    userEmail: 'email',
    userStore: 'SUCURSAL',
    userName: '',
    userLastname: '',
    userRole: 'default',
    userIdRole: '',
    salesGuard: null,
    storeDirection: '',
    notifications: getNotifications(),
  },
  mutations: {
  },
  actions: {
    setUserInfo(email)
    {
      getUserByEmail(email).then(snap => {
        snap.forEach(doc => {
          this.userEmail = doc.data().email;
          this.userStore = doc.data().store;
          this.userName = doc.data().name;
          this.userLastname = doc.data().lastname;
          this.userRole = doc.data().role;
        });
      });
    }
  },
  getters: {
    actualStore(state)
    {
      return state.userStore;
    },
  },
  modules: {
  }
})
