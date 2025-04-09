// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDmBnk4XnzSEq0wPXBW1tHAHgOcUTICGsg",
	authDomain: "awesome-project-5cb2a.firebaseapp.com",
	projectId: "awesome-project-5cb2a",
	storageBucket: "awesome-project-5cb2a.firebasestorage.app",
	messagingSenderId: "847822676051",
	appId: "1:847822676051:web:3c0905a04a5984c4e0a6a6",
	measurementId: "G-5R1RFZ5R2R",
};

// Initialize Firebase
export const FirebaseClientApp = initializeApp(firebaseConfig);
export const db = getFirestore(FirebaseClientApp);
