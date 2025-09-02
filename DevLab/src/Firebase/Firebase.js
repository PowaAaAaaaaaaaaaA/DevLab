// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import{getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC61d0DTvZOQrBT9nzVjrsesekjZMYAUoE",
  authDomain: "devlab-b8a1e.firebaseapp.com",
  projectId: "devlab-b8a1e",
  storageBucket: "devlab-b8a1e.firebasestorage.app",
  messagingSenderId: "871275485475",
  appId: "1:871275485475:web:47b922283bf3e9d5a41496" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
