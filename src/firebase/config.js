// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPRcqWwJp0pbx1CtlAa8Qi5D5bwUKOhXQ",
  authDomain: "lext-c5d4a.firebaseapp.com",
  projectId: "lext-c5d4a",
  storageBucket: "lext-c5d4a.firebasestorage.app",
  messagingSenderId: "1025914652483",
  appId: "1:1025914652483:web:802a58bf74c111bbb891f6",
  measurementId: "G-W7LW56C27M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Firebase (uncomment when you add Firebase SDK)
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);

export default app;
