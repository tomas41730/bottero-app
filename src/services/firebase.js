import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyDjbEnoK1pjBt_Fo-AGleZkMnXTvbV0g2U",
    authDomain: "bottero-app-3a25c.firebaseapp.com",
    projectId: "bottero-app-3a25c",
    storageBucket: "bottero-app-3a25c.appspot.com",
    messagingSenderId: "457339812031",
    appId: "1:457339812031:web:fedc9131fc973bade06e0a",
    measurementId: "G-G7DBTNSJJ6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();
  const db = firebase.firestore();
  export const storage = firebase.storage();
  export const actualDate = firebase.firestore;
  export default db;
  //export default storage;
