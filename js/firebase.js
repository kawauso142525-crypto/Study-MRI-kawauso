import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* Firebase設定 */
const firebaseConfig = {

  apiKey: "YOUR_API_KEY",

  authDomain:
    "YOUR_PROJECT.firebaseapp.com",

  projectId: "YOUR_PROJECT",

  appId: "YOUR_APP_ID"

};

const app = initializeApp(firebaseConfig);

/* Firestore */
const db = getFirestore(app);

/* Auth */
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

/* グローバル公開 */
window.firebaseDB = db;

window.firebaseAuth = auth;

window.firebaseProvider = provider;

/* Auth関数 */
window.firebaseAuthLib = {

  signInWithPopup,

  onAuthStateChanged

};

/* Firestore関数 */
window.firebaseFunctions = {

  doc,

  setDoc,

  getDoc,

  deleteDoc

};

console.log("Firebase ready");
