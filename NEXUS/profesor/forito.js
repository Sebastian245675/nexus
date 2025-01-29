// Importa las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, push, ref } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Configuración de Firebase
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
const db = getDatabase(app);  // Inicializa la base de datos en tiempo real
const auth = getAuth(app);

// Enviar mensajes al chat
document.getElementById('send').addEventListener('click', function () {
    const message = document.getElementById('message').value;

    // En este caso, usaremos "Anónimo" si no hay un usuario autenticado
    const user = auth.currentUser ? auth.currentUser.email : 'Anónimo';

    // Verificamos si el campo de mensaje está vacío
    if (message === '') {
        alert('No puedes enviar un mensaje vacío.');
        return;
    }

    const chatRef = ref(db, 'messages'); // Referencia a la base de datos en 'messages'

    // Empujar un nuevo mensaje a la base de datos
    push(chatRef, {
        user: user,
        message: message,
        timestamp: Date.now()
    }).then(() => {
        console.log('Mensaje enviado correctamente');
        alert('Mensaje enviado correctamente'); // Confirmación visual para el usuario
        document.getElementById('message').value = ''; // Limpiar el campo de texto después de enviar
    }).catch((error) => {
        console.error('Error al enviar el mensaje:', error.message);
        alert('Error al enviar el mensaje: ' + error.message); // Mostramos el error en una alerta
    });
});
