import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Función para cargar las convocatorias del estudiante
async function loadConvocatorias(userId) {
    const coursesList = document.getElementById("coursesList");
    coursesList.innerHTML = ""; // Limpiar la lista de cursos previos

    const clasesRef = collection(db, "clases");
    const q = query(clasesRef, where("studentId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        coursesList.innerHTML = "<p>No tienes convocatorias abiertas.</p>";
        return;
    }

    querySnapshot.forEach((doc) => {
        const claseData = doc.data();
        const convocatoriaName = claseData.convocatoria;

        const courseItem = document.createElement("div");
        courseItem.className = "course-item";
        courseItem.setAttribute("data-course-id", doc.id); // Guardar el ID del curso
        courseItem.innerHTML = `
            <h4>${convocatoriaName}</h4>
            <button class="btn-aula" data-course-name="${convocatoriaName}">Ir al aula virtual</button>
        `;
        coursesList.appendChild(courseItem);

        courseItem.querySelector(".btn-aula").addEventListener("click", (event) => {
            const courseName = event.target.getAttribute("data-course-name");
            window.location.href = `aulavprofe.html?course=${encodeURIComponent(courseName)}`;
        });

        // Evento click para cambiar la vista principal
        courseItem.addEventListener("click", () => {
            changeMainView(convocatoriaName); // Pasar el nombre de la convocatoria
        });
    });
}

// Verificar si el usuario está autenticado y cargar sus convocatorias
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadConvocatorias(user.uid);
    } else {
        console.log("Usuario no autenticado");
    }
});

// Función para cambiar la vista principal (puedes personalizar esta función según tus necesidades)
function changeMainView(convocatoriaName) {
    console.log("Cambiando la vista principal a:", convocatoriaName);
    // Aquí puedes agregar la lógica para cambiar la vista principal
}