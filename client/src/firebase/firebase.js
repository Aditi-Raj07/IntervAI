// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6P8Es-zuC2IRVXK9IOFWKSG-8oAzppzA",
  authDomain: "interviewai-3f4fe.firebaseapp.com",
  projectId: "interviewai-3f4fe",
  storageBucket: "interviewai-3f4fe.firebasestorage.app",
  messagingSenderId: "708628162695",
  appId: "1:708628162695:web:4306d9f0e1992e7ae63022",
  measurementId: "G-NW4PJ8CCTE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);