import { initializeApp }
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getFirestore,

  doc,
  setDoc,
  getDoc,
  deleteDoc,

  collection,
  getDocs

}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {

  getAuth,

  signInWithPopup,

  GoogleAuthProvider,

  onAuthStateChanged

}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* =========================
   Firebase設定
========================= */
const firebaseConfig = {

  apiKey:
    "AIzaSyC-Qon2VZv-heyBTBYLCrpwC_C5MDMrNws",

  authDomain:
    "study-mri.firebaseapp.com",

  projectId:
    "study-mri",

  appId:
    "1:231073050806:web:7d68cdc26e940b54cd7617"

};

/* =========================
   初期化
========================= */
const app =
  initializeApp(
    firebaseConfig
  );

/* Firestore */
const db =
  getFirestore(app);

/* Auth */
const auth =
  getAuth(app);

const provider =
  new GoogleAuthProvider();

/* =========================
   グローバル公開
========================= */
window.firebaseDB =
  db;

window.firebaseAuth =
  auth;

window.firebaseProvider =
  provider;

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
  deleteDoc,

  collection,
  getDocs

};

console.log(
  "Firebase ready"
);

/* =========================
   読込完了通知
========================= */
window.firebaseReady =
  true;

document.dispatchEvent(

  new Event(
    "firebase-ready"
  )

);

