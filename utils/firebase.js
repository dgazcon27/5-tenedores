import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAeP9fLTsoopBbc1HLsSjliAN-rWXHfjNk",
  authDomain: "tenedores-515f9.firebaseapp.com",
  databaseURL: "https://tenedores-515f9.firebaseio.com",
  projectId: "tenedores-515f9",
  storageBucket: "tenedores-515f9.appspot.com",
  messagingSenderId: "902508205889",
  appId: "1:902508205889:web:da0fbbf58061a396cdf3c0",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
