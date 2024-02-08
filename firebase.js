import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue} from "firebase/database";
import "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD3e2s7bsLdLqexBDlLpFRkYKwvhZWSkcI",
    authDomain: "dazzling-task-384407.firebaseapp.com",
    databaseURL: "https://dazzling-task-384407-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dazzling-task-384407",
    storageBucket: "dazzling-task-384407.appspot.com",
    messagingSenderId: "918288613127",
    appId: "1:918288613127:web:ca571f23d5865bdd778fa2"
  };


  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase()

  export {db, ref, onValue};