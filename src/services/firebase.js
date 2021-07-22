import firebase from 'firebase/app'
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyCcDuwTdTsiIQCh9SL5w2on9wP3IYDhW10",
    authDomain: "bottero-app.firebaseapp.com",
    projectId: "bottero-app",
    storageBucket: "bottero-app.appspot.com",
    messagingSenderId: "798287138265",
    appId: "1:798287138265:web:651902f5fc169b25ee5dc8",
    measurementId: "G-XKM6C95B3R"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();
  const db = firebase.firestore();

  export default db;