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
  firebase.initializeApp(firebaseConfig);
  var storage = firebase.storage();
  
  // Elementos del DOM
  var fileInput = document.getElementById('file-input');
  var uploadButton = document.getElementById('upload-button');
  var profilePic = document.getElementById('profile-pic');
  
  // Habilitar el botón de subir cuando se selecciona una imagen
  fileInput.addEventListener('change', function() {
    if (fileInput.files.length > 0) {
        uploadButton.disabled = false; // Habilitar el botón
    } else {
        uploadButton.disabled = true;  // Deshabilitar el botón si no hay imagen
    }
  });
  
  // Subir la imagen cuando se hace clic en el botón
  uploadButton.addEventListener('click', function() {
    var file = fileInput.files[0]; // Obtener el archivo seleccionado
  
    if (!file) {
        alert("Por favor selecciona una imagen antes de subir.");
        return;
    }
  
    // Verificar que el usuario esté autenticado
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // Crear la referencia en Firebase Storage con el UID del usuario
            var storageRef = storage.ref('profile_pics/' + user.uid + '/' + file.name);
  
            // Subir la imagen
            storageRef.put(file).then(function(snapshot) {
                console.log('Imagen subida correctamente.');
  
                // Obtener la URL de descarga de la imagen subida
                return storageRef.getDownloadURL();
            }).then(function(url) {
                profilePic.src = url; // Actualizar la imagen de perfil con la URL
                console.log('Imagen disponible en:', url);
  
                // Guardar la URL en el almacenamiento local del navegador (opcional)
                localStorage.setItem('profilePicUrl', url);
            }).catch(function(error) {
                console.error('Error al subir la imagen o obtener la URL:', error);
            });
        } else {
            alert("Debes estar logueado para subir una foto de perfil.");
        }
    });
  });
  
  // Recuperar la imagen de perfil al cargar la página si el usuario está autenticado
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // Obtener la referencia de la imagen en Firebase Storage
        var storageRef = storage.ref('profile_pics/' + user.uid);
        
        // Listar todos los archivos en la carpeta del usuario
        storageRef.listAll().then(function(result) {
            result.items[0].getDownloadURL().then(function(url) {
                profilePic.src = url; // Establecer la imagen de perfil al cargar
            });
        }).catch(function(error) {
            console.error("Error al recuperar la imagen de perfil:", error);
        });
    }
  });