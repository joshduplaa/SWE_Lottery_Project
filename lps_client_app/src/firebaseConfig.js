// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth"; 

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyCNn8nnfBKqmVeQ4Yv43qwBK6nwHapA55k",
  authDomain: "swelotteryproject.firebaseapp.com",
  databaseURL: "https://swelotteryproject-default-rtdb.firebaseio.com",
  projectId: "swelotteryproject",
  storageBucket: "swelotteryproject.appspot.com",
  messagingSenderId: "618762604574",
  appId: "1:618762604574:web:52192c20e077aa36509e0f",
  measurementId: "G-K7Y2W3R9QH"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

// initialize firestore

const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };
