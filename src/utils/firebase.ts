import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyC4GZCNRwbS-iEKWwui5cPPdCB0WZk7grw",
  authDomain: "qomments-project.firebaseapp.com",
  projectId: "qomments-project",
  storageBucket: "qomments-project.appspot.com",
  messagingSenderId: "657199052469",
  appId: "1:657199052469:web:cf616776b623e28601b0fc",
  measurementId: "G-VPFJ5S5Q3E",
});

const auth = getAuth(app);
const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence);

export { auth, db };
