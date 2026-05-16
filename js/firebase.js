import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-Qon2VZv-heyBTBYLCrpwC_C5MDMrNws",
  authDomain: "study-mri.firebaseapp.com",
  projectId: "study-mri",
  storageBucket: "study-mri.firebasestorage.app",
  messagingSenderId: "231073050806",
  appId: "1:231073050806:web:7d68cdc26e940b54cd7617"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.firebaseDB = db;
window.firebaseFunctions = { doc, setDoc, getDoc, deleteDoc };