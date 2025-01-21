// Importar los SDKs de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

// Configuración de Firebase (reemplaza con los valores de tu proyecto Firebase)
var firebaseConfig = {
    apiKey: "AIzaSyB0gh9Hq5JXTEmeqvsJHLVQULdH1W7YffM",
    authDomain: "nexus-5c53d.firebaseapp.com",
    projectId: "nexus-5c53d",
    storageBucket: "nexus-5c53d.appspot.com",
    messagingSenderId: "208164583979",
    appId: "1:208164583979:web:8fd62a5c315fe50ad7486e",
    measurementId: "G-WENGRWS7N9"
};
// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Función para manejar el inicio de sesión con token personalizado
function handleCustomTokenLogin() {
    // Obtener el token desde los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); // Detecta el token en la URL

    if (token) {
        // Intentar iniciar sesión con el token personalizado
        signInWithCustomToken(auth, token)
            .then((userCredential) => {
                console.log('Usuario autenticado:', userCredential.user);
                
                // Aquí puedes redirigir al dashboard o cargar datos adicionales
            })
            .catch((error) => {
                console.error('Error al iniciar sesión con el token:', error);
                alert('Error de autenticación: ' + error.message);
                // Redirigir al login si el token no es válido
                window.location.href = '/login.html';
            });
    } 
}

// Llamar la función cuando cargue la página
handleCustomTokenLogin();