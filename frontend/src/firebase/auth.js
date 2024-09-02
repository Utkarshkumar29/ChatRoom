// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getStorage } from 'firebase/storage'
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB4xj3LrXMOfUZfytFZA3RILrZ0lgEfF3A",
    authDomain: "chatrooms-2f5bc.firebaseapp.com",
    projectId: "chatrooms-2f5bc",
    storageBucket: "chatrooms-2f5bc.appspot.com",
    messagingSenderId: "998170279518",
    appId: "1:998170279518:web:f7a302a4da160f15e5becf",
    measurementId: "G-26HY49WL31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage=getStorage(app)

export { auth, provider, signInWithPopup, storage };
