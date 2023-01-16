import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCZNLzhqU8Ct5NaR0TaVnAP6VCmsr0GVKw",
    authDomain: "dev-manament.firebaseapp.com",
    projectId: "dev-manament",
    storageBucket: "dev-manament.appspot.com",
    messagingSenderId: "587211790702",
    appId: "1:587211790702:web:d7ccdd4190aa44f65d097f",
    measurementId: "G-X22WX8FCN7"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)
export default firebaseApp
