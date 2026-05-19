import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {

  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* =========================
   Firebase設定
========================= */
const firebaseConfig = {

  apiKey: "AIzaSyC-Qon2VZv-heyBTBYLCrpwC_C5MDMrNws",

  authDomain: "study-mri.firebaseapp.com",

  projectId: "study-mri",

  appId: "1:231073050806:web:7d68cdc26e940b54cd7617"
};

/* =========================
   初期化
========================= */
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* =========================
   Firestore安全ラッパー
   （重要：実務安定化）
========================= */
async function safeSet(path, data) {

  try {

    await setDoc(doc(db, "tables", path), {
      data,
      updatedAt: Date.now()
    });

  } catch (e) {
    console.error("setDoc error:", e);
  }
}

async function safeGet(path) {

  try {

    const snap = await getDoc(doc(db, "tables", path));

    if (!snap.exists()) return null;

    return snap.data().data;

  } catch (e) {
    console.error("getDoc error:", e);
    return null;
  }
}

async function safeDelete(path) {

  try {
    await deleteDoc(doc(db, "tables", path));
  } catch (e) {
    console.error("deleteDoc error:", e);
  }
}

async function safeList(folderPath) {

  try {

    const colRef = collection(db, "tables", folderPath, "files");
    const snap = await getDocs(colRef);

    const result = [];

    snap.forEach(d => result.push(d.id));

    return result;

  } catch (e) {
    console.error("getDocs error:", e);
    return [];
  }
}

/* =========================
   グローバル公開（重要）
========================= */
window.firebaseDB = db;
window.firebaseAuth = auth;
window.firebaseProvider = provider;

/* Auth API */
window.firebaseAuthLib = {
  signInWithPopup,
  onAuthStateChanged
};

/* Firestore API（拡張版） */
window.firebaseFunctions = {

  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,

  /* 追加ラッパー */
  safeSet,
  safeGet,
  safeDelete,
  safeList
};

/* =========================
   読込完了通知
========================= */
console.log("Firebase ready");

document.dispatchEvent(new Event("firebase-ready"));