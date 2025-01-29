// Importar dependencias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, setDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";

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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Función para cargar las convocatorias y las postulaciones
async function loadUserCourses(userId) {
    const postulacionesSection = document.getElementById("postulaciones");
    postulacionesSection.innerHTML = ""; // Limpiar el contenido previo

    try {
        const convocatoriasRef = collection(db, "convocatorias");
        const q = query(convocatoriasRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach(async function(doc) {
                const convocatoriaData = doc.data();
                const convocatoriaId = doc.id;

                // Crear contenedor para la convocatoria
                const convocatoriaDiv = document.createElement("div");
                convocatoriaDiv.className = "convocatoria-item";
                convocatoriaDiv.id = "convocatoria-" + convocatoriaId;
                convocatoriaDiv.innerHTML = 
                    "<h4>" + convocatoriaData.institution + " - " + convocatoriaData.level + "</h4>" +
                    "<h5>Postulaciones:</h5>" +
                    '<div id="postulaciones-' + convocatoriaId + '" class="postulaciones-list">' +
                        "<p>Cargando postulaciones...</p>" +
                    "</div>";

                postulacionesSection.appendChild(convocatoriaDiv);

                // Cargar postulaciones asociadas a esta convocatoria
                await loadPostulations(convocatoriaData.institution, convocatoriaId);
            });
        } else {
            postulacionesSection.innerHTML = "<p>No tienes convocatorias abiertas.</p>";
        }
    } catch (error) {
        console.error("Error al cargar las convocatorias:", error);
        postulacionesSection.innerHTML = "<p>Error al cargar las convocatorias.</p>";
    }
}

// Función para cargar las postulaciones asociadas a una convocatoria
async function loadPostulations(institutionName, convocatoriaId) {
    const postulacionesList = document.getElementById("postulaciones-" + convocatoriaId);
    postulacionesList.innerHTML = ""; // Limpiar contenido previo

    try {
        // Consultar las postulaciones basadas en la institución de la convocatoria
        const postulacionesRef = collection(db, "postulaciones");
        const q = query(postulacionesRef, where("convocatoria", "==", institutionName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach(function(doc) {
                const postData = doc.data();
                const postItem = document.createElement("div");
                postItem.className = "post-item";
                postItem.id = doc.id; // Asignar el ID de la postulación al elemento
                postItem.innerHTML = 
                    "<p><strong>Nombre:</strong> " + postData.nombre + "</p>" +
                    "<p><strong>Motivo:</strong> " + postData.motivo + "</p>" +
                    "<p><strong>ID:</strong> " + postData.userId + "</p>";

                // Crear botones dinámicamente
                const buttonsDiv = document.createElement("div");
                buttonsDiv.classList.add("buttons");

                // Botón Aceptar
                const acceptButton = document.createElement("button");
                acceptButton.classList.add("accept-button");
                acceptButton.textContent = "Aceptar";
                acceptButton.onclick = () => handleAccept(doc.id, postData); // Llama a la función para aceptar

                // Botón Rechazar
                const rejectButton = document.createElement("button");
                rejectButton.classList.add("reject-button");
                rejectButton.textContent = "Rechazar";
                rejectButton.onclick = () => handleReject(doc.id); // Llama a la función para rechazar

                // Añadir los botones al contenedor de botones
                buttonsDiv.appendChild(acceptButton);
                buttonsDiv.appendChild(rejectButton);

                // Añadir los botones al contenedor de la postulación
                postItem.appendChild(buttonsDiv);
                postulacionesList.appendChild(postItem);
            });
        } else {
            postulacionesList.innerHTML = "<p>No hay postulaciones asociadas.</p>";
        }
    } catch (error) {
        console.error("Error al cargar las postulaciones:", error);
        postulacionesList.innerHTML = "<p>Error al cargar las postulaciones.</p>";
    }
}

// Función para aceptar una postulación y guardarla en la colección 'clases'
async function handleAccept(postulationId, postData) {
    try {
        // Obtener el nombre de la convocatoria, ID y nombre del estudiante
        const studentId = postData.userId; // ID del estudiante
        const studentName = postData.nombre; // Nombre del estudiante
        const convocatoriaName = postData.convocatoria; // Nombre de la convocatoria

        // Guardar la clase en la colección 'clases'
        const classRef = collection(db, "clases");
        await setDoc(doc(classRef), {
            convocatoria: convocatoriaName, // Nombre de la convocatoria
            studentId: studentId, // ID del estudiante
            studentName: studentName, // Nombre del estudiante
            status: "Aceptado", // Estado de la postulación
            createdAt: new Date() // Fecha de creación
        });

        console.log("Postulación aceptada y guardada en 'clases'");

        // Eliminar el elemento del DOM
        const postulationElement = document.getElementById(postulationId);
        if (postulationElement) {
            postulationElement.remove();
        }

    } catch (error) {
        console.error("Error al aceptar la postulación:", error);
    }
}

// Función para rechazar una postulación
async function handleReject(postulationId) {
    try {
        const postulationRef = doc(db, "postulaciones", postulationId);
        await deleteDoc(postulationRef);
        console.log("Postulación rechazada");

        // Eliminar el elemento del DOM
        const postulationElement = document.getElementById(postulationId);
        if (postulationElement) {
            postulationElement.remove();
        }
    } catch (error) {
        console.error("Error al rechazar la postulación:", error);
    }
}

// Verificar si el usuario está autenticado y cargar sus convocatorias
onAuthStateChanged(auth, function(user) {
    if (user) {
        loadUserCourses(user.uid);
    } else {
        console.log("Usuario no autenticado");
        const postulacionesSection = document.getElementById("postulaciones");
        postulacionesSection.innerHTML = "<p>Inicia sesión para ver tus convocatorias.</p>";
    }
});