import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA29B1M73CgD4Y839lQXCJSIGz6PeVO4q0",
  authDomain: "gen-lang-client-0939365739.firebaseapp.com",
  projectId: "gen-lang-client-0939365739",
  storageBucket: "gen-lang-client-0939365739.firebasestorage.app",
  messagingSenderId: "243445431076",
  appId: "1:243445431076:web:4b8ca99792314b79d2d1b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID
export const db = getFirestore(app, "ai-studio-9d9ce03b-03b7-4615-82c5-8c06c8b94fc5");

// Initialize Auth
export const auth = getAuth(app);
