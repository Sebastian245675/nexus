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

  const userName = document.getElementById("user-name");
  const userAge = document.getElementById("user-age");
  const userProfession = document.getElementById("user-profession");
  const userCountry = document.getElementById("user-country");
  const userCity = document.getElementById("user-city");

  const profileInfo = document.getElementById("profile-info");

  if (userInfo) {
      // Si existe la información del usuario, mostramos los datos
      userName.textContent = `${userInfo.firstName} ${userInfo.lastName}`;
      userAge.textContent = userInfo.age;
      userProfession.textContent = userInfo.profession;
      userCountry.textContent = userInfo.country;
      userCity.textContent = userInfo.city;

      // Mostramos el perfil
      profileInfo.style.display = "block";
  } else {
      // Si no existe la información, mostramos mensaje
      userName.textContent = "Información no disponible";
      userAge.textContent = "Información no disponible";
      userProfession.textContent = "Información no disponible";
      userCountry.textContent = "Información no disponible";
      userCity.textContent = "Información no disponible";

      profileInfo.style.display = "block";
  }
}

// Escucha cambios en el estado de autenticación
onAuthStateChanged(auth, async (user) => {
  const viewProfileBtn = document.getElementById("view-profile-btn");
  
  if (user) {
      const userId = user.uid;

      // Mostrar perfil solo cuando el usuario haga clic en "Ver Perfil"
      viewProfileBtn.addEventListener("click", () => {
          showUserProfile(userId);
      });
  } else {
      console.log("Usuario no autenticado");
  }
});