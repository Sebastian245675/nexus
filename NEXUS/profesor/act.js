import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
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

// Función para cargar los talleres y actividades del estudiante
async function loadItems(userId) {
    const itemsList = document.getElementById("itemsList");
    itemsList.innerHTML = ""; // Limpiar la lista de elementos previos

    const clasesRef = collection(db, "clases");
    const q = query(clasesRef, where("studentId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        itemsList.innerHTML = "<p>No tienes talleres ni actividades pendientes.</p>";
        return;
    }

    const cursos = [];
    querySnapshot.forEach((doc) => {
        const claseData = doc.data();
        cursos.push(claseData.convocatoria);
    });

    // Cargar talleres
    const talleresRef = collection(db, "talleres");
    const talleresQuery = query(talleresRef, where("nombreCurso", "in", cursos));
    const talleresSnapshot = await getDocs(talleresQuery);

    talleresSnapshot.forEach((doc) => {
        const tallerData = doc.data();
        const item = document.createElement("div");
        item.className = "item";
        item.setAttribute("data-taller-id", doc.id); // Guardar el ID del taller
        item.innerHTML = `
            <h4>Taller: ${tallerData.nombreCurso}</h4>
            <p>${tallerData.descripcion}</p>
            <p><strong>Fecha de Inicio:</strong> ${tallerData.fechaInicio}</p>
            <p><strong>Fecha de Fin:</strong> ${tallerData.fechaFin}</p>
            <p><strong>Nombre del Taller:</strong> ${tallerData.nombreTaller}</p>
            <p><strong>Estandares de Calificación:</strong> ${tallerData.estandaresCalificacion}</p>
            <p><strong>Timestamp:</strong> ${tallerData.timestamp.toDate()}</p>
            <button class="btn-upload" data-taller-id="${doc.id}">Cargar Documento/Foto</button>
        `;
        itemsList.appendChild(item);

        item.querySelector(".btn-upload").addEventListener("click", (event) => {
            const tallerId = event.target.getAttribute("data-taller-id");
            window.location.href = `cargarDocumento.html?taller=${encodeURIComponent(tallerId)}`;
        });
    });

    // Cargar actividades simples
    const actividadesRef = collection(db, "actividades");
    const actividadesQuery = query(actividadesRef, where("nombreCurso", "in", cursos));
    const actividadesSnapshot = await getDocs(actividadesQuery);

    actividadesSnapshot.forEach((doc) => {
        const actividadData = doc.data();
        const item = document.createElement("div");
        item.className = "item";
        item.setAttribute("data-actividad-id", doc.id); // Guardar el ID de la actividad
        item.innerHTML = `
            <h4>Actividad Simple: ${actividadData.nombreCurso}</h4>
            <p>${actividadData.descripcion}</p>
            <p><strong>Título:</strong> ${actividadData.titulo}</p>
            <p><strong>Timestamp:</strong> ${actividadData.timestamp.toDate()}</p>
            <button class="btn-detalle" data-actividad-id="${doc.id}">Iniciar</button>
        `;
        itemsList.appendChild(item);

        item.querySelector(".btn-detalle").addEventListener("click", (event) => {
            const actividadId = event.target.getAttribute("data-actividad-id");
            loadActivity(actividadId);
        });
    });
}

// Función para cargar la actividad seleccionada
async function loadActivity(actividadId) {
    const activityContainer = document.getElementById("activityContainer");
    const questionsList = document.getElementById("questionsList");
    questionsList.innerHTML = ""; // Limpiar la lista de preguntas previas

    const actividadDoc = await getDoc(doc(db, "actividades", actividadId));
    if (actividadDoc.exists()) {
        const actividadData = actividadDoc.data();
        actividadData.preguntas.forEach((pregunta, index) => {
            const questionItem = document.createElement("div");
            questionItem.className = "question";
            questionItem.innerHTML = `
                <h3>Pregunta ${index + 1}: ${pregunta.pregunta}</h3>
                <div class="options">
                    <label><input type="radio" name="pregunta${index}" value="A"> ${pregunta.opciones.A}</label>
                    <label><input type="radio" name="pregunta${index}" value="B"> ${pregunta.opciones.B}</label>
                    <label><input type="radio" name="pregunta${index}" value="C"> ${pregunta.opciones.C}</label>
                    <label><input type="radio" name="pregunta${index}" value="D"> ${pregunta.opciones.D}</label>
                </div>
            `;
            questionsList.appendChild(questionItem);
        });

        const submitButton = document.getElementById("submitActivity");
        submitButton.onclick = () => submitActivity(actividadId, actividadData.preguntas.length);

        activityContainer.style.display = "flex";
    } else {
        console.log("No se encontró la actividad.");
    }
}

// Función para enviar las respuestas de la actividad
async function submitActivity(actividadId, numPreguntas) {
    const user = auth.currentUser;
    if (!user) {
        console.log("Usuario no autenticado");
        return;
    }

    const respuestas = [];
    for (let i = 0; i < numPreguntas; i++) {
        const respuesta = document.querySelector(`input[name="pregunta${i}"]:checked`);
        respuestas.push(respuesta ? respuesta.value : null);
    }

    await setDoc(doc(collection(db, "realizados")), {
        actividadId,
        userId: user.uid,
        respuestas,
        timestamp: new Date()
    });

    alert("Respuestas enviadas correctamente.");
    document.getElementById("activityContainer").style.display = "none";
}

// Verificar si el usuario está autenticado y cargar sus talleres y actividades
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadItems(user.uid);
    } else {
        console.log("Usuario no autenticado");
    }
});