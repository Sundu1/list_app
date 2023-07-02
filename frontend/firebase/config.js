// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7lpIU1VsXcU68oxex1AII73nolGVZTXc",
  authDomain: "list-app-80e45.firebaseapp.com",
  projectId: "list-app-80e45",
  storageBucket: "list-app-80e45.appspot.com",
  messagingSenderId: "98765207224",
  appId: "1:98765207224:web:148674b93988dcb810e64d",
  measurementId: "G-BM54V3M2T4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);