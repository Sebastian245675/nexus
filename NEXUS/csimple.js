// Inicializar Firebase (esto ya está incluido en el <script> del HTML)
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
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore(app);
  
  // Función para guardar la actividad en Firestore
  document.getElementById('actividadSimpleForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir que el formulario se envíe de forma convencional
  
    // Obtener los valores del formulario
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
  
    // Obtener preguntas y respuestas
    const preguntas = [];
    const preguntaElements = document.querySelectorAll('.pregunta-group');
  
    preguntaElements.forEach(preguntaElement => {
      const pregunta = preguntaElement.querySelector('.pregunta').value;
      const opcionA = preguntaElement.querySelector('input[name="opcionA"]').value;
      const opcionB = preguntaElement.querySelector('input[name="opcionB"]').value;
      const opcionC = preguntaElement.querySelector('input[name="opcionC"]').value;
      const opcionD = preguntaElement.querySelector('input[name="opcionD"]').value;
  
      preguntas.push({
        pregunta,
        opciones: {
          A: opcionA,
          B: opcionB,
          C: opcionC,
          D: opcionD
        }
      });
    });
  
    // Verificar que los campos no estén vacíos
    if (!titulo || !descripcion || preguntas.length === 0) {
      alert('Por favor, complete todos los campos.');
      return;
    }
  
    // Guardar los datos en Firestore
    db.collection("actividades").add({
      titulo: titulo,
      descripcion: descripcion,
      preguntas: preguntas,
      fechaCreacion: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      alert('Actividad guardada con éxito!');
      // Limpiar el formulario o redirigir al usuario si es necesario
      document.getElementById('actividadSimpleForm').reset();
    })
    .catch((error) => {
      console.error('Error al guardar la actividad: ', error);
      alert('Hubo un error al guardar la actividad. Intenta nuevamente.');
    });
  });