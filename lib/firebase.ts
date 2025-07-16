import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDiD50SgB5dZ_ib2sL5kmnQQ0cnSUm7u_I",
  authDomain: "po-toforio-1bb55.firebaseapp.com",
  databaseURL: "https://po-toforio-1bb55-default-rtdb.firebaseio.com",
  projectId: "po-toforio-1bb55",
  storageBucket: "po-toforio-1bb55.firebasestorage.app",
  messagingSenderId: "414014291914",
  appId: "1:414014291914:web:ed5aaabbbb09da46105933",
  measurementId: "G-DYDS2N67YH"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);