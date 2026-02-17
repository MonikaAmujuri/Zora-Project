import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAebRlbHu3BK8QEMvtp0CvLxmBUveQ4lmc",
  authDomain: "zora-auth.firebaseapp.com",
  projectId: "zora-auth",
  storageBucket: "zora-auth.firebasestorage.app",
  messagingSenderId: "328800153512",
  appId: "1:328800153512:web:5164f3a5ddb201fb8af79d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);