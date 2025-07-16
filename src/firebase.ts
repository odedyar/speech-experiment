// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// מסיר את Analytics כי לא צריך אותו כרגע
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDx4mrSwaIwGvDoYCmbBYXNAdE5VBLmzrs",
  authDomain: "speech-experiment-87060.firebaseapp.com",
  projectId: "speech-experiment-87060",
  storageBucket: "speech-experiment-87060.firebasestorage.app",
  messagingSenderId: "524800489410",
  appId: "1:524800489410:web:c3db2b57d5d911323e085b",
  measurementId: "G-FGRZCTKQW5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// מסיר את Analytics כי לא צריך אותו כרגע
// const analytics = getAnalytics(app);

export default app;
