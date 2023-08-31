// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEPqwJk2Ec7cOpOA00nx4MjsIMupql2GY",
  authDomain: "artworks-39beb.firebaseapp.com",
  projectId: "artworks-39beb",
  storageBucket: "artworks-39beb.appspot.com",
  messagingSenderId: "891456684628",
  appId: "1:891456684628:web:534d3a114ab3bf933ce3c1",
  measurementId: "G-YYB6F48FP6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app

export const auth = getAuth();
export const db = getFirestore(app)