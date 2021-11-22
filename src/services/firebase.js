import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'

var firebaseConfig = {
    apiKey: "AIzaSyBQmvwC2ZRHoR5qazzsxN0S0J41ziryOx8",
    authDomain: "botteroadmin.firebaseapp.com",
    projectId: "botteroadmin",
    storageBucket: "botteroadmin.appspot.com",
    messagingSenderId: "498220363012",
    appId: "1:498220363012:web:d720c4872d5d40b7e17451",
    measurementId: "G-5JTZ274C84"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();
  const db = firebase.firestore();
  export const storage = firebase.storage();
  export const actualDate = firebase.firestore;
  export const auth = firebase.auth();
  export default db;
  //export default storage;
