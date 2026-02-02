import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCzd9OGPn89CsBrAof71ZPYpE40Lb8vE0",
  authDomain: "hpflexxapp.firebaseapp.com",
  projectId: "hpflexxapp",
  storageBucket: "hpflexxapp.firebasestorage.app",
  messagingSenderId: "420715701064",
  appId: "1:420715701064:web:2494dd4e2793d67c7f097d",
  measurementId: "G-VHGTF78GGV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
