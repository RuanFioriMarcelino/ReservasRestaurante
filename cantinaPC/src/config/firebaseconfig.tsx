import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getStorage, getDownloadURL } from "firebase/storage";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyACRt8a3-yoUIY4gFAo7I88SDpuF5XeumY",
  authDomain: "cantina-24414.firebaseapp.com",
  projectId: "cantina-24414",
  storageBucket: "cantina-24414.appspot.com",
  messagingSenderId: "171170548344",
  appId: "1:171170548344:web:1e9fb563c62f6a17f47b8d",
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const auth = getAuth(app);
export const storage = getStorage(app);
export {
  database,
  collection,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
};
