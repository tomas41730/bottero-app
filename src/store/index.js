import Vue from 'vue'
import Vuex from 'vuex'
import { getUserByEmail } from '../services/firestore/FirebaseUsers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logoBottero: 'https://firebasestorage.googleapis.com/v0/b/botteroadmin.appspot.com/o/utilities%2Flogo.png?alt=media&token=ec2d4d87-9102-4ae0-8328-e52154af033d',
    userEmail: 'email',
    userStore: 'SUCURSAL',
    userName: '',
    userLastname: '',
    userRole: 'default'

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
  modules: {
  }
})
