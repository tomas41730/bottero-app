import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'

//Bottero
const firebaseConfig = {
  apiKey: "AIzaSyBQmvwC2ZRHoR5qazzsxN0S0J41ziryOx8",
  authDomain: "botteroadmin.firebaseapp.com",
  projectId: "botteroadmin",
  storageBucket: "botteroadmin.appspot.com",
  messagingSenderId: "498220363012",
  appId: "1:498220363012:web:2837ddec54eb5498e17451",
  measurementId: "G-LWYGXNHYYV"
};

//Pruebabioinfo
// const firebaseConfig = {
//   apiKey: "AIzaSyCcDuwTdTsiIQCh9SL5w2on9wP3IYDhW10",
//   authDomain: "bottero-app.firebaseapp.com",
//   projectId: "bottero-app",
//   storageBucket: "bottero-app.appspot.com",
//   messagingSenderId: "798287138265",
//   appId: "1:798287138265:web:651902f5fc169b25ee5dc8",
//   measurementId: "G-XKM6C95B3R"
//   };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();
  const db = firebase.firestore();
  export const storage = firebase.storage();
  export const actualDate = firebase.firestore;
  export const auth = firebase.auth();
  export default db;
  //export default storage;
