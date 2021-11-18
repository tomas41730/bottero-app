import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'

// var firebaseConfig = {
//     apiKey: "AIzaSyDjbEnoK1pjBt_Fo-AGleZkMnXTvbV0g2U",
//     authDomain: "bottero-app-3a25c.firebaseapp.com",
//     projectId: "bottero-app-3a25c",
//     storageBucket: "bottero-app-3a25c.appspot.com",
//     messagingSenderId: "457339812031",
//     appId: "1:457339812031:web:fedc9131fc973bade06e0a",
//     measurementId: "G-G7DBTNSJJ6"
//   };

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
  export const storage = firebase.storage();
  export const actualDate = firebase.firestore;
  export const auth = firebase.auth();
  export default db;
  //export default storage;
