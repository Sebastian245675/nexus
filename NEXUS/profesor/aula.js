import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";

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
const storage = getStorage(app);

// Obtener el nombre del curso desde la URL
const urlParams = new URLSearchParams(window.location.search);
const courseName = urlParams.get('course');

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
        // Crear el formulario para subir el archivo
        const contentElement = document.createElement("li");
        contentElement.innerHTML = `
          <div class="content-item">
            <strong>${contentName}</strong>
            <input type="file" class="file-input" />
          </div>
        `;
        folderElement.querySelector(".contents").appendChild(contentElement);
      }
    });

    // Añadir la carpeta al listado principal
    document.getElementById("folders-list").appendChild(folderElement);
  }
});

// Guardar datos en Firebase Firestore y subir los archivos
document.getElementById("save-changes").addEventListener("click", async () => {
  const folders = [];
  
  // Recorrer todas las carpetas creadas
  for (let folder of document.querySelectorAll("#folders-list .folder")) {
    const folderName = folder.querySelector("strong").textContent;
    const subfolders = Array.from(folder.querySelectorAll(".subfolders li")).map(li => li.textContent);
    const contents = [];

    // Recorrer todos los contenidos (archivos)
    for (let contentElement of folder.querySelectorAll(".contents li")) {
      const contentName = contentElement.querySelector("strong").textContent;
      const fileInput = contentElement.querySelector(".file-input");
      const file = fileInput?.files[0];

      if (file) {
        const storageRef = ref(storage, `cursos/${courseName}/${folderName}/${contentName}/${file.name}`);

        try {
          // Subir el archivo a Firebase Storage
          const uploadTask = await uploadBytes(storageRef, file);

          // Obtener la URL del archivo subido
          const fileURL = await getDownloadURL(uploadTask.ref);
          console.log("URL del archivo subido:", fileURL);

          // Agregar el contenido con la URL del archivo a la carpeta
          contents.push({
            name: contentName,
            fileURL: fileURL,
          });
        } catch (error) {
          console.error("Error al subir el archivo:", error);
          alert("Ocurrió un error al subir un archivo.");
          return;
        }
      } else {
        // Si no se sube un archivo, solo se guarda el nombre del contenido sin URL
        contents.push({
          name: contentName,
          fileURL: null,
        });
      }
    }

    // Agregar la carpeta con sus subcarpetas y contenidos al array principal
    folders.push({
      name: folderName,
      subfolders,
      contents,
    });
  }

  try {
    // Guardar toda la estructura en Firestore
    const docRef = await addDoc(collection(db, "aula"), {
      courseName,
      folders,
    });
    alert("Cambios guardados exitosamente en Firestore.");
  } catch (error) {
    console.error("Error al guardar en Firestore:", error);
    alert("Ocurrió un error al guardar los datos.");
  }
});