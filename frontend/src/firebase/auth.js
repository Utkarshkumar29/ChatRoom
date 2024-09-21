// firebase.js
import { initializeApp, firebase } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getStorage } from 'firebase/storage'

import 'firebase/auth';
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

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user; // Access user info

    // Get credential from result, but ensure we check if it's not null
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential) {
      console.error("No credential returned from sign-in.");
      throw new Error("No credential returned from sign-in.");
    }

    const token = credential.idToken;

    console.log('User Info:', user);
    console.log('Credential:', credential);
    console.log('Access Token:', token);

    return { user, credential }; // Return both user and credential
  } catch (error) {
    console.error('Error during sign-in: ', error);
    throw error; // Re-throw error for handling in the component
  }
};

export { auth, provider, signInWithPopup, storage, signInWithGoogle };
