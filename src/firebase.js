// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBc5acNDQTUS30f8Ba7TMjZ2wHe2n_bvk",
  authDomain: "whatsapp-clone-617d4.firebaseapp.com",
  projectId: "whatsapp-clone-617d4",
  storageBucket: "whatsapp-clone-617d4.firebasestorage.app",
  messagingSenderId: "1070934583719",
  appId: "1:1070934583719:web:4f072ab331f79894cfee82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);