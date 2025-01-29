// Importa las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, onValue, ref, push } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyB0gh9Hq5JXTEmeqvsJHLVQULdH1W7YffM",
    authDomain: "nexus-5c53d.firebaseapp.com",
    projectId: "nexus-5c53d",
    storageBucket: "nexus-5c53d.appspot.com",
    messagingSenderId: "208164583979",
    appId: "1:208164583979:web:8fd62a5c315fe50ad7486e",
    measurementId: "G-WENGRWS7N9"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

const messagesRef = ref(db, 'messages');

// Recupera la imagen de perfil del usuario autenticado
function getProfilePicUrl(userId) {
    const storageRef = storage.ref('profile_pics/' + userId);
    return storageRef.listAll().then(result => {
        if (result.items.length > 0) {
            return result.items[0].getDownloadURL(); // Devuelve la URL de la primera imagen
        } else {
            throw new Error("No se encontró ninguna imagen de perfil para este usuario.");
        }
    });
}

// Escuchar los cambios en la base de datos
onValue(messagesRef, (snapshot) => {
    const messagesDiv = document.getElementById('messages');
    if (messagesDiv) {
        messagesDiv.innerHTML = '';  // Limpiar el contenido actual

        snapshot.forEach((childSnapshot) => {
            const messageData = childSnapshot.val();

            // Crear un contenedor para el mensaje
            const messageContainer = document.createElement('div');
            messageContainer.className = 'message-container';

            // Crear la imagen de perfil
            const profilePic = document.createElement('img');
            profilePic.className = 'profile-pic';
            profilePic.src = messageData.profilePic;  // Usa la URL de la imagen de perfil
            profilePic.alt = 'Foto de perfil';

            // Crear el elemento de mensaje
            const messageElement = document.createElement('p');
            messageElement.textContent = ${messageData.user}: ${messageData.message};

            // Agregar la imagen de perfil y el mensaje al contenedor
            messageContainer.appendChild(profilePic);
            messageContainer.appendChild(messageElement);

            // Agregar el contenedor de mensaje a la lista de mensajes
            messagesDiv.appendChild(messageContainer);
        });
    }
});

// Enviar mensajes al chat
document.getElementById('send').addEventListener('click', async function () {
    const message = document.getElementById('message').value;
    const user = "usuario@example.com"; // Cambia esto según cómo obtengas el usuario actual
    const userId = "ID_DEL_USUARIO"; // Asegúrate de usar el ID correcto del usuario

    if (message.trim() === '') {
        alert('No puedes enviar un mensaje vacío.');
        return;
    }

    try {
        const profilePicUrl = await getProfilePicUrl(userId); // Obtiene la URL de la imagen de perfil

        // Guarda el mensaje junto con el usuario y la URL de la imagen de perfil en la base de datos
        push(messagesRef, {
            user: user,
            message: message,
            profilePic: profilePicUrl
        });

        // Limpia el campo de entrada de mensaje
        document.getElementById('message').value = '';
    } catch (error) {
        console.error("Error al obtener la imagen de perfil:", error);
    }
});