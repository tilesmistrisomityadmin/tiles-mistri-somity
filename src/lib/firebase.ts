import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCnisLuOMp7eW51OuOLJb_lf7ndQz4Ictk",
  authDomain: "tiles-mistri-somity-app.firebaseapp.com",
  databaseURL: "https://tiles-mistri-somity-app-default-rtdb.firebaseio.com",
  projectId: "tiles-mistri-somity-app",
  storageBucket: "tiles-mistri-somity-app.firebasestorage.app",
  messagingSenderId: "535233000691",
  appId: "1:535233000691:web:10b1f4abbf9da80c533386"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
