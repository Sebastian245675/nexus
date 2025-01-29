
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import {
    createUserWithEmailAndPassword,
    getAuth
} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyB0gh9Hq5JXTEmeqvsJHLVQULdH1W7YffM",
    authDomain: "nexus-5c53d.firebaseapp.com",
    projectId: "nexus-5c53d",
    storageBucket: "nexus-5c53d.appspot.com",
    messagingSenderId: "208164583979",
    appId: "1:208164583979:web:8fd62a5c315fe50ad7486e",
    measurementId: "G-WENGRWS7N9"
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

document.getElementById('registro-form').addEventListener('submit', (e) => {
    e.preventDefault();  // Prevent form from submitting normally

    const email = document.getElementById('emailreg').value;
    const password = document.getElementById('passwordreg').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            alert("Usuario creado");
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                alert('El correo ya está en uso');
            } else if (errorCode === 'auth/invalid-email') {
                alert('El correo no es válido');
            } else if (errorCode === 'auth/weak-password') {
                alert('La contraseña debe tener al menos 6 caracteres');
            } else {
                alert('Error: ' + error.message);
            }
        });
});