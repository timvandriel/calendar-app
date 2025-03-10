
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCSfGF9m_GZT0bM5oOPw05zQRqECitJD7E",
    authDomain: "fnof-stack-5884c.firebaseapp.com",
    projectId: "fnof-stack-5884c",
    storageBucket: "fnof-stack-5884c.firebasestorage.app",
    messagingSenderId: "865707808577",
    appId: "1:865707808577:web:af78f07f724efed9fd73c0",
    measurementId: "G-VDP6CE0ETR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };