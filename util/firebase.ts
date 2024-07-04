import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC14FhbYX7xLGJIQE9r5OnFZymgaMQqmMc",
  authDomain: "chatapp-1cb68.firebaseapp.com",
  projectId: "chatapp-1cb68",
  storageBucket: "chatapp-1cb68.appspot.com",
  messagingSenderId: "462452336783",
  appId: "1:462452336783:web:6cd63084ea6bede54868fa",
  measurementId: "G-V18Z7ZQ9XK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
