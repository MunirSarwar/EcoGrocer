import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyD1JYNLiHg8aOltD0v1FviKOyeoa7Mdx0Y",

  authDomain: "ecogrocerauth.firebaseapp.com",

  projectId: "ecogrocerauth",

  storageBucket: "ecogrocerauth.firebasestorage.app",

  messagingSenderId: "295983693464",

  appId: "1:295983693464:web:e62e7c3192e774d5ac9aed",

  measurementId: "G-RZCB5RLNLP"

};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
