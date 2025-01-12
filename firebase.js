import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";  // Add Firebase Authentication

// Use the same config from your React Native app
const firebaseConfig = {
  apiKey: "AIzaSyDa3sSx-GK66M59qwjkWBOeSS1rXEmrPLI",
  authDomain: "rentify-a6205.firebaseapp.com",
  projectId: "rentify-a6205",
  messagingSenderId: "88533148989",
  appId: "1:88533148989:android:0e8e61d55e3bb9b77f9154",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore instance
export const db = getFirestore(app);

// Firebase Authentication instance
export const auth = getAuth(app);
