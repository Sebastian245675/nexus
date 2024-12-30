import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
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
  const userRef = doc(db, "Informacion", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    return null;
  }
}

// Función para mostrar y permitir la edición de la información
async function showUserInfoAndEdit(userId) {
  const userInfo = await getUserInfo(userId);
  const infoSection = document.getElementById("infooo");

  if (userInfo) {
    infoSection.innerHTML = `
      <h2>Editar información de la cuenta</h2>
      <form id="edit-form">
        <label for="firstName">Nombre:</label>
        <input type="text" id="firstName" name="firstName" value="${userInfo.firstName}" required>
        
        <label for="lastName">Apellido:</label>
        <input type="text" id="lastName" name="lastName" value="${userInfo.lastName}" required>
        
        <label for="age">Edad:</label>
        <input type="number" id="age" name="age" value="${userInfo.age}" required>
        
        <label for="profession">Profesión:</label>
        <input type="text" id="profession" name="profession" value="${userInfo.profession}" required>
        
        <label for="country">País:</label>
        <input type="text" id="country" name="country" value="${userInfo.country}" required>
        
        <label for="city">Ciudad:</label>
        <input type="text" id="city" name="city" value="${userInfo.city}" required>
        
        <button type="submit" class="save-button">Guardar cambios</button>
      </form>
    `;

    const editForm = document.getElementById("edit-form");
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const updatedData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        age: parseInt(document.getElementById("age").value),
        profession: document.getElementById("profession").value,
        country: document.getElementById("country").value,
        city: document.getElementById("city").value,
      };

      try {
        const userRef = doc(db, "Informacion", userId);
        await updateDoc(userRef, updatedData);
        alert("Información actualizada con éxito.");
        showUserInfoAndEdit(userId); // Refresca los datos en la interfaz
      } catch (error) {
        console.error("Error al actualizar la información: ", error);
        alert("Hubo un error al actualizar la información.");
      }
    });
  } else {
    infoSection.innerHTML = `
      <h2>Información de la cuenta</h2>
      <p>Parece que aún no has completado tu perfil. Por favor, llena la información requerida.</p>
    `;
  }
}

// Escucha cambios en el estado de autenticación
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userId = user.uid;
    await showUserInfoAndEdit(userId); // Permite mostrar y editar la información
  } else {
    const infoSection = document.getElementById("infooo");
    infoSection.innerHTML = `
      <h2>Información de la cuenta</h2>
      <p>Usuario no autenticado. Inicia sesión para ver y editar tu información.</p>
    `;
  }
});