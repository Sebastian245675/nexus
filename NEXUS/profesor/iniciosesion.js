import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut
} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

import {
    doc,
    getDoc,
    getFirestore
} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js'; // Import Firestore

const firebaseConfig = {
    apiKey: "AIzaSyB0gh9Hq5JXTEmeqvsJHLVQULdH1W7YffM",
    authDomain: "nexus-5c53d.firebaseapp.com",
    projectId: "nexus-5c53d",
    storageBucket: "nexus-5c53d.appspot.com",
    messagingSenderId: "208164583979",
    appId: "1:208164583979:web:8fd62a5c315fe50ad7486e",
    measurementId: "G-WENGRWS7N9"
  };

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);  // Inicialización de Firestore

// Manejo del inicio de sesión
document.getElementById('login').addEventListener('click', async (e) => {
    e.preventDefault();  // Prevenir el envío del formulario de manera normal

    const email = document.getElementById('emaillog').value;
    const password = document.getElementById('passwordlog').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Inicio de sesión exitoso");

        // Verificar si ya tiene un rol asignado
        const user = userCredential.user;
        const userRef = doc(db, "users", user.uid);  // Referencia al documento del usuario
        const userDoc = await getDoc(userRef);  // Obtener el documento

        if (userDoc.exists() && userDoc.data().role) {
            var role = userDoc.data().role;
            // Redirigir según el rol
            if (role === "profesor") {
                window.location.href = "prfesor.html";
            } else if (role === "student") {
                window.location.href = "/pagina_estudiante.html";
            }
        } else {
            // Si no tiene rol, redirigir a la página de selección de roles
            window.location.href = 'roles.html';
        }
    } catch (error) {
        const errorCode = error.code;
        if (errorCode === 'auth/wrong-password') {
            alert('Contraseña incorrecta');
        } else if (errorCode === 'auth/user-not-found') {
            alert('Usuario no encontrado');
        } else if (errorCode === 'auth/invalid-email') {
            alert('Correo no es válido');
        } else {
            alert('Error: ' + error.message);
        }
    }
});

// Cerrar sesión
document.getElementById('cerrar').addEventListener('click', async (e) => {
    e.preventDefault();  // Prevenir el envío del formulario

    try {
        await signOut(auth);
        alert("Cierre de sesión exitoso");
        window.location.href = "/login.html";  // Redirigir al login después de cerrar sesión
    } catch (error) {
        alert('Error al cerrar sesión: ' + error.message);
    }
});