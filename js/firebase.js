import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyA-EC-ojtjgbyHveWl5hrK_QHZj0_UYR1U",

  authDomain: "sutdy-mri.firebaseapp.com",

  projectId: "sutdy-mri",

  storageBucket: "sutdy-mri.firebasestorage.app",

  messagingSenderId: "545750822895",

  appId: "1:545750822895:web:ed90771306d29513f6d01a"
};

const app =
  initializeApp(firebaseConfig);

const db =
  getFirestore(app);

window.firebaseDB = db;

window.firebaseFunctions = {

  doc,
  setDoc,
  getDoc
};