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
  
  // Elemento del DOM donde se mostrará la imagen de perfil
  var profilePic = document.getElementById('profile-pic');
  
  // Recuperar la imagen de perfil al cargar la página si el usuario está autenticado
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // Obtener la referencia de la imagen en Firebase Storage
        var storageRef = storage.ref('profile_pics/' + user.uid);
  
        // Listar todos los archivos en la carpeta del usuario
        storageRef.listAll().then(function(result) {
            if (result.items.length > 0) {
                // Obtener la URL del primer archivo de la lista
                result.items[0].getDownloadURL().then(function(url) {
                    profilePic.src = url; // Establecer la imagen de perfil al cargar
                });
            } else {
                console.log("No se encontró ninguna imagen de perfil para este usuario.");
            }
        }).catch(function(error) {
            console.error("Error al recuperar la imagen de perfil:", error);
        });
    } else {
        console.log("El usuario no está autenticado.");
    }
  });