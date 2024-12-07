// Importa las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, onValue, ref } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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
initializeApp(firebaseConfig);

// Obtener la referencia a la base de datos
const db = getDatabase();
const messagesRef = ref(db, 'messages');

// Escuchar los cambios en la base de datos
onValue(messagesRef, (snapshot) => {
    const messagesDiv = document.getElementById('messages');
    if (messagesDiv) {
        messagesDiv.innerHTML = '';  // Limpiar el contenido actual

        snapshot.forEach((childSnapshot) => {
            const messageData = childSnapshot.val();
            const messageElement = document.createElement('p');
            // Usar concatenación de cadenas en lugar de interpolación
            messageElement.textContent = messageData.user + ': ' + messageData.message;
            messagesDiv.appendChild(messageElement);
        });
    }
});
