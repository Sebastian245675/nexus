import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Configura Firebase
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

// Obtener el nombre del curso desde la URL
const urlParams = new URLSearchParams(window.location.search);
const courseName = urlParams.get('course');  // Esto obtiene el valor del parámetro 'course' en la URL

if (!courseName) {
  alert("No se ha encontrado el nombre del curso.");
}

// Funcionalidad para agregar carpetas
document.getElementById("add-folder").addEventListener("click", () => {
  const folderName = prompt("Ingrese el nombre de la carpeta:");

  if (folderName) {
    const folderElement = document.createElement("li");
    folderElement.classList.add("folder");

    folderElement.innerHTML = `
      <div class="folder-header">
        <strong>${folderName}</strong>
        <button class="add-subfolder">+ Subcarpeta</button>
        <button class="add-content">+ Contenido</button>
      </div>
      <ul class="subfolders"></ul>
      <ul class="contents"></ul>
    `;

    // Función para agregar subcarpetas
    folderElement.querySelector(".add-subfolder").addEventListener("click", () => {
      const subfolderName = prompt("Ingrese el nombre de la subcarpeta:");
      if (subfolderName) {
        const subfolderElement = document.createElement("li");
        subfolderElement.textContent = subfolderName;
        folderElement.querySelector(".subfolders").appendChild(subfolderElement);
      }
    });

    // Función para agregar contenido
    folderElement.querySelector(".add-content").addEventListener("click", () => {
      const contentName = prompt("Ingrese el nombre del contenido:");
      if (contentName) {
        const contentElement = document.createElement("li");
        contentElement.textContent = contentName;
        folderElement.querySelector(".contents").appendChild(contentElement);
      }
    });

    // Añade la carpeta al listado principal
    document.getElementById("folders-list").appendChild(folderElement);
  }
});

// Guardar datos en Firebase Firestore
document.getElementById("save-changes").addEventListener("click", async () => {
  const folders = [];

  // Recorre todas las carpetas creadas
  document.querySelectorAll("#folders-list .folder").forEach(folder => {
    const folderName = folder.querySelector("strong").textContent;
    const subfolders = Array.from(folder.querySelectorAll(".subfolders li")).map(li => li.textContent);
    const contents = Array.from(folder.querySelectorAll(".contents li")).map(li => li.textContent);

    folders.push({
      name: folderName,
      subfolders,
      contents,
    });
  });

  try {
    // Usamos addDoc para crear un nuevo documento con un ID único
    const docRef = await addDoc(collection(db, "aula"), {
      courseName,  // Agregar el nombre del curso a los datos
      folders,
    });
    alert("Cambios guardados en un nuevo documento en Firestore.");
  } catch (error) {
    console.error("Error al guardar en Firestore:", error);
    alert("Ocurrió un error al guardar los datos.");
  }
});