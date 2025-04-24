// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyA9Fwlzn9R6Z47zfh2pKdjwlYEjuV--yrE",
	authDomain: "hopterlinkapp.firebaseapp.com",
	projectId: "hopterlinkapp",
	storageBucket: "hopterlinkapp.firebasestorage.app",
	messagingSenderId: "217728306884",
	appId: "1:217728306884:web:267e79b4d99ed383a78391",
	measurementId: "G-2RT7PBG5G3",
};

// Initialize Firebase
export const FirebaseClientApp = initializeApp(firebaseConfig);
export const db = getFirestore(FirebaseClientApp);
