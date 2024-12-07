// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, off } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0gh9Hq5JXTEmeqvsJHLVQULdH1W7YffM",
  authDomain: "nexus-5c53d.firebaseapp.com",
  projectId: "nexus-5c53d",
  storageBucket: "nexus-5c53d.appspot.com",
  messagingSenderId: "208164583979",
  appId: "1:208164583979:web:8fd62a5c315fe50ad7486e",
  measurementId: "G-WENGRWS7N9"
};

// Inicializar Firebase
initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth();

var currentForum = null; // Variable para almacenar el foro seleccionado
var currentUser = null; // Variable para almacenar el usuario autenticado

// Detectar si hay un usuario autenticado
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log('Usuario autenticado:', user.displayName || user.email);
  } else {
    alert("Por favor, inicia sesión para acceder a los foros.");
    // Aquí podrías redirigir al usuario a una página de inicio de sesión si no está autenticado
  }
});

// Crear un nuevo foro
document.getElementById('create-forum').addEventListener('click', function() {
  var forumName = document.getElementById('new-forum-name').value.trim();

  if (forumName === '') {
    alert('El nombre del foro no puede estar vacío.');
    return;
  }

  var forumsRef = ref(db, 'foros/' + encodeURIComponent(forumName));

  // Crear el nuevo foro con nombre y espacio para mensajes
  set(forumsRef, {
    nombre: forumName,
    mensajes: {}  // Espacio vacío para futuros mensajes
  }).then(function() {
    console.log('Foro creado correctamente:', forumName);
    alert('Foro creado correctamente: ' + forumName);
    document.getElementById('new-forum-name').value = ''; // Limpiar el campo
    loadForums(); // Cargar la lista de foros
  }).catch(function(error) {
    console.error('Error al crear el foro:', error);
    alert('Error al crear el foro: ' + error.message);
  });
});

// Cargar y mostrar los foros existentes (sin duplicaciones)
function loadForums() {
  console.log('Cargando foros...');
  var forumsList = document.getElementById('forums-list');
  forumsList.innerHTML = ''; // Limpiar la lista actual

  var forumsRef = ref(db, 'foros');

  // Remover cualquier listener previo antes de establecer uno nuevo
  off(forumsRef);

  onValue(forumsRef, function(snapshot) {
    forumsList.innerHTML = ''; // Limpiar lista para evitar duplicaciones
    if (snapshot.exists()) {
      snapshot.forEach(function(childSnapshot) {
        var forumName = decodeURIComponent(childSnapshot.key);
        var forumElement = document.createElement('div');
        forumElement.className = 'forum-item';
        forumElement.textContent = forumName;

        // Cuando se hace clic, carga los mensajes de este foro
        forumElement.addEventListener('click', function() {
          currentForum = forumName;
          loadMessages(forumName);
        });

        forumsList.appendChild(forumElement);
      });
    } else {
      console.log('No hay foros disponibles');
      forumsList.innerHTML = '<p>No hay foros creados</p>';
    }
  });
}

// Función para formatear la hora a una cadena legible
function formatTimestamp(timestamp) {
  var date = new Date(timestamp);
  var hours = date.getHours().toString().padStart(2, '0');
  var minutes = date.getMinutes().toString().padStart(2, '0');
  return hours + ':' + minutes;
}

// Cargar mensajes del foro seleccionado (con hora de envío)
function loadMessages(forumName) {
  var messagesRef = ref(db, 'foros/' + encodeURIComponent(forumName) + '/mensajes');
  var messagesContainer = document.getElementById('messages');
  messagesContainer.innerHTML = ''; // Limpiar mensajes anteriores

  // Remover cualquier listener previo antes de establecer uno nuevo
  off(messagesRef);

  onValue(messagesRef, function(snapshot) {
    messagesContainer.innerHTML = ''; // Limpiar contenedor para evitar duplicaciones
    if (snapshot.exists()) {
      snapshot.forEach(function(messageSnapshot) {
        var messageData = messageSnapshot.val();
        var messageElement = document.createElement('div');
        var timeString = formatTimestamp(messageData.timestamp);
        messageElement.textContent = messageData.user + " [" + timeString + "]: " + messageData.message;
        messagesContainer.appendChild(messageElement);
      });
    } else {
      messagesContainer.innerHTML = '<p>No hay mensajes en este foro</p>';
    }
  });
}

// Enviar mensajes al foro seleccionado
document.getElementById('send').addEventListener('click', function() {
  var message = document.getElementById('message').value;

  if (message === '') {
    alert('No puedes enviar un mensaje vacío.');
    return;
  }

  if (!currentForum) {
    alert('Por favor, selecciona un foro para enviar el mensaje.');
    return;
  }

  if (!currentUser) {
    alert('Debes iniciar sesión para enviar mensajes.');
    return;
  }

  var chatRef = ref(db, 'foros/' + encodeURIComponent(currentForum) + '/mensajes');

  // Empujar un nuevo mensaje al foro seleccionado, usando el nombre del usuario autenticado
  push(chatRef, {
    user: currentUser.displayName || currentUser.email, // Usa displayName si está disponible, o el email del usuario
    message: message,
    timestamp: Date.now()
  }).then(function() {
    console.log('Mensaje enviado correctamente');
    alert('Mensaje enviado correctamente');
    document.getElementById('message').value = ''; // Limpiar el campo de texto después de enviar
  }).catch(function(error) {
    console.error('Error al enviar el mensaje:', error.message);
    alert('Error al enviar el mensaje: ' + error.message);
  });
});

// Asegurarse de cargar los foros solo cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
  loadForums();
});