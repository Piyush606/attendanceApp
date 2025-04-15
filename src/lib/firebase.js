// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAD8cqSfYjPMefRoz_nchuu5-XXl6DpBm4",
  authDomain: "attendanceapp-4db43.firebaseapp.com",
  projectId: "attendanceapp-4db43",
  storageBucket: "attendanceapp-4db43.firebasestorage.app",
  messagingSenderId: "544115409497",
  appId: "1:544115409497:web:3c0835ccbb84126d286748"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);