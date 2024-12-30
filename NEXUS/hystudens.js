// Importar los módulos necesarios de Firebase
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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/**
 * Función para cargar los cursos del estudiante.
 * Busca en la colección "clases" los documentos cuyo studentId coincide con el ID del usuario autenticado.
 */
async function loadStudentCourses(userId) {
    const coursesList = document.getElementById("coursesList");
    coursesList.innerHTML = ""; // Limpiar la lista de cursos previos

    const clasesRef = collection(db, "clases");
    const q = query(clasesRef, where("studentId", "==", userId)); // Buscar por el ID del estudiante

    try {
        const querySnapshot = await getDocs(q);

        // Depuración: Verificar los datos obtenidos
        console.log("Cursos encontrados:", querySnapshot.docs.map(doc => doc.data()));

        // Crear un arreglo de cursos para poder comparar con los talleres
        let courses = [];
        querySnapshot.forEach((doc) => {
            const claseData = doc.data();
            courses.push(claseData.convocatoria); // Guardamos el nombre del curso

            const courseItem = document.createElement("div");
            courseItem.className = "course-item";
            courseItem.innerHTML = `
                <h4>${claseData.convocatoria}</h4> <!-- Mostrar el nombre del curso -->
                <p><strong>Status:</strong> ${claseData.status}</p>
            `;
            coursesList.appendChild(courseItem);

            // Evento click para cambiar la vista principal
            courseItem.addEventListener("click", () => {
                changeMainView(claseData.convocatoria); // Pasar el nombre de la convocatoria
            });
        });

        // Mensaje si no hay cursos inscritos
        if (querySnapshot.empty) {
            coursesList.innerHTML = "<p>No estás inscrito en ningún curso.</p>";
        }

        // Cargar talleres pendientes
        loadPendingWorkshops(courses);

    } catch (error) {
        console.error("Error al cargar los cursos:", error);
        coursesList.innerHTML = "<p>Error al cargar los cursos. Intenta nuevamente.</p>";
    }
}

/**
 * Función para cargar los talleres pendientes basados en los cursos del estudiante.
 * @param {Array} courses - Array de cursos del estudiante.
 */
async function loadPendingWorkshops(courses) {
    const workshopsList = document.getElementById("pendingWorkshops");
    workshopsList.innerHTML = ""; // Limpiar la lista de talleres previos

    const talleresRef = collection(db, "talleres"); // Suponiendo que los talleres están en la colección "talleres"
    const q = query(talleresRef); // Obtenemos todos los talleres

    try {
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const tallerData = doc.data();

            // Verificar si el nombre del curso del taller coincide con alguno de los cursos del estudiante
            if (courses.includes(tallerData.nombreCurso)) {
                const workshopItem = document.createElement("div");
                workshopItem.className = "workshop-item";
                workshopItem.innerHTML = `
                    <h4>${tallerData.nombreTaller}</h4> <!-- Mostrar el nombre del taller -->
                    <p><strong>Status:</strong> ${tallerData.status}</p>
                `;
                workshopsList.appendChild(workshopItem);
            }
        });

    } catch (error) {
        console.error("Error al cargar los talleres:", error);
    }
}

/**
 * Función para cambiar la vista principal y mostrar información detallada del curso.
 * @param {string} courseName - Nombre de la convocatoria del curso.
 */
async function changeMainView(courseName) {
    const mainView = document.querySelector(".principal");
    mainView.innerHTML = `<h2>${courseName}</h2><p>Cargando detalles...</p>`; // Indicador de carga

    // Si necesitas cargar más detalles, puedes agregar la lógica aquí.
    // Por ejemplo, buscar más datos relacionados con la convocatoria en otra colección.
}

// Verificar si el usuario está autenticado y cargar sus cursos
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuario autenticado:", user.uid); // Verificar el ID del usuario autenticado
        loadStudentCourses(user.uid);
    } else {
        console.log("Usuario no autenticado");
    }
});