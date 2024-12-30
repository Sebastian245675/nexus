import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

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

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Función para obtener la información del usuario desde Firestore
async function getUserInfo(userId) {
  const userRef = doc(db, "Informacion", userId); // Referencia al documento del usuario
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    // Retorna los datos del usuario si el documento existe
    return userSnap.data();
  } else {
    // Si no existe, retorna null o algún valor predeterminado
    return null;
  }
}

// Función para mostrar la información del usuario en el perfil
async function showUserProfile(userId) {
  const userInfo = await getUserInfo(userId);
  
  const perfilDiv = document.getElementById("perfil");

  if (userInfo) {
    // Si existe la información del usuario, mostramos los datos en el perfil
    perfilDiv.style.display = "block"; // Mostramos la sección de perfil
    perfilDiv.innerHTML = `
      <p> ${userInfo.firstName} ${userInfo.lastName}</p>
      <p>Edad: ${userInfo.age}</p>
      <p>Profesión: ${userInfo.profession}</p>
      <p>País: ${userInfo.country}</p>
      <p>Ciudad: ${userInfo.city}</p>
    `;
  } else {
    // Si no existe la información, mostramos un mensaje
    perfilDiv.style.display = "block"; // Mostramos la sección de perfil
    perfilDiv.innerHTML =` <h1>Completa tu perfil</h1><p>Parece que aún no has completado tu perfil. Por favor, llena la información requerida.</p>`;
  }
}

// Escucha cambios en el estado de autenticación
onAuthStateChanged(auth, async (user) => {
  const perfilDiv = document.getElementById("perfil");

  if (user) {
    const userId = user.uid;
    await showUserProfile(userId); // Muestra el perfil del usuario si está autenticado
  } else {
    perfilDiv.style.display = "none"; // Oculta la sección de perfil si no hay un usuario autenticado
    console.log("Usuario no autenticado");
  }
});