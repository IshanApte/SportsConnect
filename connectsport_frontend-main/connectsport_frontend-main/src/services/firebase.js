
import { initializeApp } from "firebase/app";
// import { GoogleAuthProvider } from "firebase/auth";
// import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZe-9pm3NjhPQcup4nEJJk7T01jTmWV3E",
  authDomain: "connectsport-123.firebaseapp.com",
  projectId: "connectsport-123",
  storageBucket: "connectsport-123.appspot.com",
  messagingSenderId: "729505597142",
  appId: "1:729505597142:web:280c5aa4c388f92065ab77",
  measurementId: "G-KMJPBSF5P0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;

// const provider = new GoogleAuthProvider();

// const auth = getAuth();
// auth.languageCode = 'it';
// To apply the default browser preference instead of explicitly setting it.
// auth.useDeviceLanguage();
