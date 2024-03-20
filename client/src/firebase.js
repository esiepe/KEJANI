// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "kejani-estate.firebaseapp.com",
  projectId: "kejani-estate",
  storageBucket: "kejani-estate.appspot.com",
  messagingSenderId: "461219106912",
  appId: "1:461219106912:web:d26a06525e41e2faf2b305"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
