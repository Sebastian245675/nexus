// Importar las dependencias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";

// Configuración de Firebase
var firebaseConfig = {
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

// Función para cargar los cursos del usuario
function loadUserCourses(userId) {
    var courseSelect = document.getElementById("courseSelect");

    // Mensaje mientras se cargan los cursos
    courseSelect.innerHTML = '<option value="">Cargando cursos...</option>';

    // Referencia a la colección de convocatorias
    var convocatoriasRef = collection(db, "convocatorias");
    var q = query(convocatoriasRef, where("userId", "==", userId));

    getDocs(q).then(function(querySnapshot) {
        // Limpiar el select
        courseSelect.innerHTML = '<option value="">Selecciona un curso</option>';

        if (!querySnapshot.empty) {
            querySnapshot.forEach(function(doc) {
                var convocatoria = doc.data();
                var option = document.createElement("option");
                option.value = doc.id; // Usar el ID del documento
                option.textContent = convocatoria.institution + " - " + convocatoria.level;
                courseSelect.appendChild(option);
            });
        } else {
            courseSelect.innerHTML = '<option value="">No hay cursos disponibles</option>';
        }
    }).catch(function(error) {
        console.error("Error al cargar los cursos:", error);
        courseSelect.innerHTML = '<option value="">Error al cargar cursos</option>';
    });
}

// Función para cargar y mostrar información del curso seleccionado
function showCourseDetails() {
    var courseSelect = document.getElementById("courseSelect");
    var selectedOption = courseSelect.options[courseSelect.selectedIndex];

    // Contenedor para la información del curso
    var courseDetailsContainer = document.getElementById("courseDetails");

    // Limpiar el contenedor
    courseDetailsContainer.innerHTML = "";

    if (selectedOption && selectedOption.value !== "") {
        var courseId = selectedOption.value;

        // Obtener los detalles del curso desde Firestore
        var docRef = doc(db, "convocatorias", courseId);

        getDoc(docRef)
            .then((doc) => {
                if (doc.exists()) {
                    var data = doc.data();

                    // Crear el formulario de edición
                    var formHtml = `
                        <h3>Editar curso</h3>
                        <form id="editCourseForm">
                            <label for="institution">Institución:</label>
                            <input type="text" id="institution" name="institution" value="${data.institution}" required>
                            
                            <label for="level">Nivel:</label>
                            <input type="text" id="level" name="level" value="${data.level}" required>
                            
                            <label for="description">Descripción:</label>
                            <textarea id="description" name="description" rows="4" required>${data.description}</textarea>
                            
                            <button type="submit">Guardar cambios</button>
                        </form>
                    `;

                    courseDetailsContainer.innerHTML = formHtml;

                    // Manejar el envío del formulario
                    var editCourseForm = document.getElementById("editCourseForm");
                    editCourseForm.addEventListener("submit", function (e) {
                        e.preventDefault();

                        // Obtener los valores editados
                        var updatedData = {
                            institution: document.getElementById("institution").value,
                            level: document.getElementById("level").value,
                            description: document.getElementById("description").value,
                        };

                        // Actualizar el curso en Firestore
                        updateDoc(docRef, updatedData)
                            .then(() => {
                                alert("Curso actualizado con éxito.");
                                loadUserCourses(auth.currentUser.uid); // Recargar los cursos
                            })
                            .catch((error) => {
                                console.error("Error al actualizar el curso:", error);
                                alert("Error al actualizar el curso.");
                            });
                    });
                } else {
                    courseDetailsContainer.innerHTML = "<p>No se encontró información del curso.</p>";
                }
            })
            .catch((error) => {
                console.error("Error al obtener detalles del curso:", error);
                courseDetailsContainer.innerHTML = "<p>Error al cargar la información del curso.</p>";
            });
    }
}

// Escuchar cambios en la autenticación del usuario
onAuthStateChanged(auth, function (user) {
    if (user) {
        console.log("Usuario autenticado:", user.uid);
        loadUserCourses(user.uid);

        // Añadir evento al select
        var courseSelect = document.getElementById("courseSelect");
        courseSelect.addEventListener("change", showCourseDetails);
    } else {
        console.log("Usuario no autenticado");
    }
});