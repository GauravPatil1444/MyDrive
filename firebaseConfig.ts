// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaBPhJGhPeodSnvJIBL-J6HxnZkI_S2NU",
  authDomain: "mydrive-1444.firebaseapp.com",
  projectId: "mydrive-1444",
  storageBucket: "mydrive-1444.firebasestorage.app",
  messagingSenderId: "671795456919",
  appId: "1:671795456919:web:f5b4164b95e26231d672d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
