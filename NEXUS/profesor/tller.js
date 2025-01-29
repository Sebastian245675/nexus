import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
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

// Cargar cursos del usuario para el selector
function loadUserCourses(userId) {
    const courseSelect = document.getElementById("courseSelect");
    courseSelect.innerHTML = '<option value="">Cargando cursos...</option>';

    const convocatoriasRef = collection(db, "convocatorias");
    const q = query(convocatoriasRef, where("userId", "==", userId));

    getDocs(q).then((querySnapshot) => {
        courseSelect.innerHTML = '<option value="">Selecciona un curso</option>';
        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const convocatoria = doc.data();
                const option = document.createElement("option");
                option.value = convocatoria.institution; // Solo el nombre del curso
                option.textContent = convocatoria.institution;
                courseSelect.appendChild(option);
            });
        } else {
            courseSelect.innerHTML = '<option value="">No hay cursos disponibles</option>';
        }
    }).catch((error) => {
        console.error("Error al cargar los cursos:", error);
        courseSelect.innerHTML = '<option value="">Error al cargar cursos</option>';
    });
}

// Guardar taller con el nombre del curso seleccionado
document.getElementById('tallerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const courseSelect = document.getElementById('courseSelect');
    const nombreCurso = courseSelect.value;

    if (!nombreCurso) {
        alert("Por favor, selecciona un curso.");
        return;
    }

    const nombreTaller = document.getElementById('nombreTaller').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const descripcionTaller = document.getElementById('descripcionTaller').value;
    const estandaresCalificacion = document.getElementById('estandaresCalificacion').value;

    try {
        await addDoc(collection(db, "talleres"), {
            nombreCurso: nombreCurso, // Guardar el nombre del curso
            nombreTaller: nombreTaller,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            descripcion: descripcionTaller,
            estandaresCalificacion: estandaresCalificacion,
            timestamp: serverTimestamp()
        });

        alert('Taller guardado exitosamente.');
        document.getElementById('tallerForm').reset();
    } catch (error) {
        console.error("Error al guardar el taller:", error);
        alert('Hubo un error al guardar el taller.');
    }
});

// Escuchar cambios en la autenticación
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserCourses(user.uid);
    } else {
        console.log("Usuario no autenticado");
    }
});