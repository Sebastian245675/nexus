import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, off, remove } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

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
const storage = getStorage();

var currentForum = null; // Variable para almacenar el foro seleccionado
var currentUser = null; // Variable para almacenar el usuario autenticado

// Detectar si hay un usuario autenticado
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log('Usuario autenticado:', user.displayName || user.email);
    document.getElementById('fotico').src = user.photoURL || 'default-profile-pic.jpg'; // Actualizar la foto de perfil
    loadMyForums(); // Cargar los foros del usuario autenticado
  } else {
    alert("Por favor, inicia sesión para acceder a los foros.");
    // Aquí podrías redirigir al usuario a una página de inicio de sesión si no está autenticado
  }
});

// Mostrar/ocultar el campo de PIN según la opción seleccionada
document.getElementById('forum-privacy').addEventListener('change', function() {
  var pinField = document.getElementById('forum-pin');
  if (this.value === 'private') {
    pinField.style.display = 'block';
  } else {
    pinField.style.display = 'none';
  }
});

// Crear un nuevo foro
document.getElementById('create-forum').addEventListener('click', function() {
  var forumName = document.getElementById('new-forum-name').value.trim();
  var forumImage = document.getElementById('new-forum-image').files[0];
  var forumPrivacy = document.getElementById('forum-privacy').value;
  var forumPin = document.getElementById('forum-pin').value.trim();

  if (forumName === '') {
    alert('El nombre del foro no puede estar vacío.');
    return;
  }

  if (forumPrivacy === 'private' && forumPin === '') {
    alert('Por favor, ingresa un PIN para el foro privado.');
    return;
  }

  if (forumImage) {
    // Subir la imagen a Firebase Storage
    const imageRef = storageRef(storage, 'forum-images/' + forumImage.name);
    uploadBytes(imageRef, forumImage).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        // Guardar el foro en la base de datos con la URL de la imagen
        const newForumRef = push(ref(db, 'foros'));
        set(newForumRef, {
          nombre: forumName,
          imageUrl: downloadURL,
          privacy: forumPrivacy,
          pin: forumPrivacy === 'private' ? forumPin : null,
          createdBy: currentUser.uid, // Usa el UID del usuario
          createdAt: Date.now()
        }).then(() => {
          alert('Foro creado exitosamente');
          document.getElementById('new-forum-name').value = ''; // Limpiar el campo
          document.getElementById('new-forum-image').value = ''; // Limpiar el campo de imagen
          document.getElementById('forum-pin').value = ''; // Limpiar el campo de PIN
          loadMyForums(); // Cargar la lista de "Mis Foros"
        }).catch((error) => {
          console.error('Error al crear el foro:', error);
          alert('Error al crear el foro: ' + error.message);
        });
      });
    }).catch((error) => {
      console.error('Error al subir la imagen:', error);
    });
  } else {
    alert('Por favor, selecciona una imagen para el foro.');
  }
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
        var forum = childSnapshot.val();
        var forumElement = document.createElement('div');
        forumElement.className = 'forum-item';
        forumElement.innerHTML = `
          <img src="${forum.imageUrl}" alt="Foto de perfil del foro">
          <span>${forum.nombre}</span>
        `;

        // Cuando se hace clic, carga los mensajes de este foro y actualiza la imagen de perfil y el nombre del foro
        forumElement.addEventListener('click', function() {
          if (forum.privacy === 'private') {
            var storedPin = localStorage.getItem(forum.nombre);
            if (storedPin !== forum.pin) {
              var enteredPin = prompt('Este foro es privado. Por favor, ingresa el PIN:');
              if (enteredPin !== forum.pin) {
                alert('PIN incorrecto. No puedes acceder a este foro.');
                return;
              } else {
                localStorage.setItem(forum.nombre, enteredPin); // Guardar el PIN ingresado en el almacenamiento local
              }
            }
          }
          currentForum = forum.nombre;
          loadMessages(forum.nombre);
          document.getElementById('forum-profile-pic').src = forum.imageUrl; // Actualizar la imagen de perfil
          document.getElementById('forum-name').textContent = forum.nombre; // Actualizar el nombre del foro
          if (forum.createdBy === currentUser.uid) {
            document.getElementById('delete-forum').style.display = 'block'; // Mostrar el botón de eliminar foro si el usuario es el propietario
          } else {
            document.getElementById('delete-forum').style.display = 'none'; // Ocultar el botón de eliminar foro si el usuario no es el propietario
          }
        });

        forumsList.appendChild(forumElement);
      });
    } else {
      console.log('No hay foros disponibles');
      forumsList.innerHTML = '<p>No hay foros creados</p>';
    }
  });
}

// Cargar y mostrar los foros del usuario autenticado
function loadMyForums() {
  console.log('Cargando mis foros...');
  var myForumsList = document.getElementById('my-forums-list');
  myForumsList.innerHTML = ''; // Limpiar la lista actual

  var forumsRef = ref(db, 'foros');

  // Remover cualquier listener previo antes de establecer uno nuevo
  off(forumsRef);

  onValue(forumsRef, function(snapshot) {
    myForumsList.innerHTML = ''; // Limpiar lista para evitar duplicaciones
    if (snapshot.exists()) {
      snapshot.forEach(function(childSnapshot) {
        var forum = childSnapshot.val();
        if (forum.createdBy === currentUser.uid || localStorage.getItem(forum.nombre) === forum.pin) {
          var forumElement = document.createElement('div');
          forumElement.className = 'forum-item';
          forumElement.innerHTML = `
            <img src="${forum.imageUrl}" alt="Foto de perfil del foro">
            <span>${forum.nombre}</span>
          `;

          // Cuando se hace clic, carga los mensajes de este foro y actualiza la imagen de perfil y el nombre del foro
          forumElement.addEventListener('click', function() {
            currentForum = forum.nombre;
            loadMessages(forum.nombre);
            document.getElementById('forum-profile-pic').src = forum.imageUrl; // Actualizar la imagen de perfil
            document.getElementById('forum-name').textContent = forum.nombre; // Actualizar el nombre del foro
            if (forum.createdBy === currentUser.uid) {
              document.getElementById('delete-forum').style.display = 'block'; // Mostrar el botón de eliminar foro si el usuario es el propietario
            } else {
              document.getElementById('delete-forum').style.display = 'none'; // Ocultar el botón de eliminar foro si el usuario no es el propietario
            }
          });

          myForumsList.appendChild(forumElement);
        }
      });
    } else {
      console.log('No hay foros disponibles');
      myForumsList.innerHTML = '<p>No hay foros creados</p>';
    }
  });
}

// Alternar entre la vista de todos los foros y la vista de "Mis Foros"
document.getElementById('my-forums-button').addEventListener('click', function() {
  var forumsList = document.getElementById('forums-list');
  var myForumsList = document.getElementById('my-forums-list');
  if (forumsList.style.display === 'none') {
    forumsList.style.display = 'block';
    myForumsList.style.display = 'none';
    this.textContent = 'Mis Foros';
    loadForums(); // Asegurarse de cargar todos los foros
  } else {
    forumsList.style.display = 'none';
    myForumsList.style.display = 'block';
    this.textContent = 'Todos los Foros';
    loadMyForums(); // Asegurarse de cargar los foros del usuario
  }
});

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
        messageElement.className = 'message';
        var timeString = formatTimestamp(messageData.timestamp);
        var user = messageData.user.replace('@gmail.com', ''); // Omitir el dominio gmail.com
        messageElement.innerHTML = `
          <img src="${messageData.profilePicUrl}" alt="Foto de perfil" class="message-profile-pic">
          <div class="content">${user}: ${messageData.message}</div>
          <div class="timestamp">${timeString}</div>
        `;
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
    profilePicUrl: currentUser.photoURL || 'default-profile-pic.jpg', // Usa la URL de la foto de perfil del usuario o una por defecto
    timestamp: Date.now()
  }).then(function() {
    console.log('Mensaje enviado correctamente');
    document.getElementById('message').value = ''; // Limpiar el campo de texto después de enviar
  }).catch(function(error) {
    console.error('Error al enviar el mensaje:', error.message);
    alert('Error al enviar el mensaje: ' + error.message);
  });
});

// Eliminar foro
document.getElementById('delete-forum').addEventListener('click', function() {
  if (!currentForum) {
    alert('Por favor, selecciona un foro para eliminar.');
    return;
  }

  if (!currentUser) {
    alert('Debes iniciar sesión para eliminar foros.');
    return;
  }

  var forumRef = ref(db, 'foros/' + encodeURIComponent(currentForum));

  remove(forumRef).then(function() {
    alert('Foro eliminado correctamente');
    document.getElementById('messages').innerHTML = ''; // Limpiar los mensajes del foro eliminado
    document.getElementById('forum-profile-pic').src = ''; // Limpiar la imagen de perfil del foro eliminado
    document.getElementById('forum-name').textContent = ''; // Limpiar el nombre del foro eliminado
    document.getElementById('delete-forum').style.display = 'none'; // Ocultar el botón de eliminar foro
    currentForum = null; // Resetear el foro actual
    loadMyForums(); // Recargar la lista de "Mis Foros"
  }).catch(function(error) {
    console.error('Error al eliminar el foro:', error.message);
    alert('Error al eliminar el foro: ' + error.message);
  });
});

// Asegurarse de cargar los foros solo cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('forums-list').style.display = 'none';
  document.getElementById('my-forums-list').style.display = 'block';
  document.getElementById('my-forums-button').textContent = 'Todos los Foros';
  loadMyForums(); // Cargar "Mis Foros" por defecto
});