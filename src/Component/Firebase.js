// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDygcTkM6Pv9x8GT469aJ7FBL_vh_kSFQY",
  authDomain: "todowithfirebase-13d9d.firebaseapp.com",
  projectId: "todowithfirebase-13d9d",
  storageBucket: "todowithfirebase-13d9d.appspot.com",
  messagingSenderId: "957630257369",
  appId: "1:957630257369:web:1b0733f3c171fe2a8986c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export default app;
export {auth , storage , db}