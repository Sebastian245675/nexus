import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
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

// Verifica si existe información del usuario
async function checkUserInfo(userId) {
  const userRef = doc(db, "Informacion", userId); // Referencia al documento con el ID del usuario
  const userSnap = await getDoc(userRef);
  return userSnap.exists(); // Retorna true si el documento existe
}

// Crea y muestra el formulario dinámicamente
function createUserInfoForm(userId) {
  const formContainer = document.createElement("div");
  formContainer.id = "formContainer";
  formContainer.style.position = "fixed";
  formContainer.style.top = "50%";
  formContainer.style.left = "50%";
  formContainer.style.transform = "translate(-50%, -50%)";
  formContainer.style.padding = "20px";
  formContainer.style.backgroundColor = "white";
  formContainer.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
  formContainer.style.borderRadius = "8px";
  formContainer.style.zIndex = "1000";

  formContainer.innerHTML = `
    <h2>Complete su información</h2>
    <form id="userInfoForm">
      <input type="text" id="firstName" placeholder="Nombre" required /><br />
      <input type="text" id="lastName" placeholder="Apellido" required /><br />
      <input type="number" id="age" placeholder="Edad" required /><br />
      <input type="text" id="profession" placeholder="Profesión" required /><br />
      <input type="text" id="country" placeholder="País" required /><br />
      <input type="text" id="city" placeholder="Ciudad" required /><br />
      <button type="submit">Guardar</button>
    </form>
  `;

  document.body.appendChild(formContainer);

  const form = document.getElementById("userInfoForm");
  form.addEventListener("submit", (event) => handleUserInfoSubmit(event, userId));
}

// Maneja el envío del formulario
async function handleUserInfoSubmit(event, userId) {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const age = document.getElementById("age").value;
  const profession = document.getElementById("profession").value;
  const country = document.getElementById("country").value;
  const city = document.getElementById("city").value;

  const userInfo = { firstName, lastName, age, profession, country, city };

  // Guarda la información del usuario en Firestore con su userId como ID
  await setDoc(doc(db, "Informacion", userId), userInfo);

  console.log("Información del usuario guardada correctamente");
  removeUserInfoForm(); // Elimina el formulario
}

// Elimina el formulario dinámicamente
function removeUserInfoForm() {
  const formContainer = document.getElementById("formContainer");
  if (formContainer) {
    document.body.removeChild(formContainer);
  }
}

// Escucha cambios en el estado de autenticación
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userId = user.uid;

    // Verifica si existe información del usuario
    const userInfoExists = await checkUserInfo(userId);

    if (!userInfoExists) {
      console.log("Información del usuario no encontrada, mostrando formulario...");
      createUserInfoForm(userId);
    } else {
      console.log("Información del usuario ya existe.");
    }
  } else {
    console.log("Usuario no autenticado");
  }
});