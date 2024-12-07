document.addEventListener('DOMContentLoaded', function () {
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

    // Inicialización de Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore(app);

    let currentStep = 1;
    const totalSteps = 5;
    const steps = document.querySelectorAll('.step');
    const nextBtns = [
        document.getElementById('nextBtn1'),
        document.getElementById('nextBtn2'),
        document.getElementById('nextBtn3'),
        document.getElementById('nextBtn4'),
    ];
    const submitBtn = document.getElementById('submitBtn');

    // Inputs
    const institutionName = document.getElementById('institutionName');
    const level = document.getElementById('level');
    const description = document.getElementById('description');
    const uploadDocs = document.getElementById('uploadDocs');
    const fileOptions = document.querySelectorAll('.file-option');
    const fileTypeInput = document.getElementById('fileType');
    const rules = document.getElementById('rules');

    // Función para validar campos
    function validateField(step) {
        let isValid = false;

        // Validación del Paso 1: Nombre de la Institución
        if (step === 1) {
            isValid = institutionName.value.trim() !== '';
        }

        // Validación del Paso 2: Nivel Educativo
        if (step === 2) {
            isValid = level.value !== '';
        }

        // Validación del Paso 3: Descripción
        if (step === 3) {
            isValid = description.value.trim() !== '';
        }

        // Validación del Paso 4: Requisitos y Cargue de Archivos
        if (step === 4) {
            if (uploadDocs.checked) {
                const selectedFileTypes = Array.from(fileOptions).some(option => option.checked);
                isValid = selectedFileTypes;
            } else {
                isValid = true; // Si no se requiere cargar documentos, el paso es válido
            }
        }

        // Validación del Paso 5: Reglas
        if (step === 5) {
            isValid = rules.value.trim() !== '';
        }

        // Habilitar el siguiente botón si el campo es válido
        if (isValid) {
            nextBtns[step - 1].disabled = false;
        } else {
            nextBtns[step - 1].disabled = true;
        }

        // Si estamos en el último paso, habilitar el botón de enviar
        if (step === 5 && isValid) {
            submitBtn.disabled = false;
        }
    }

    // Mostrar siguiente paso
    function nextStep() {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
            validateField(currentStep);
        }
    }

    // Mostrar el paso actual
    function showStep(step) {
        steps.forEach(s => s.classList.remove('active'));
        steps[step - 1].classList.add('active');
        steps[step - 1].style.opacity = 1;
    }

    // Verificar los campos al cambiarlos
    institutionName.addEventListener('input', () => validateField(1));
    level.addEventListener('change', () => validateField(2));
    description.addEventListener('input', () => validateField(3));
    uploadDocs.addEventListener('change', () => {
        if (uploadDocs.checked) {
            fileTypeInput.classList.remove('hidden');
        } else {
            fileTypeInput.classList.add('hidden');
        }
        validateField(4);
    });
    fileOptions.forEach(option => {
        option.addEventListener('change', () => validateField(4));
    });
    rules.addEventListener('input', () => validateField(5));

    // Enviar datos a Firestore cuando se complete el formulario
    submitBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        const institutionValue = institutionName.value.trim();
        const levelValue = level.value;
        const descriptionValue = description.value.trim();
        const allowedFileTypes = Array.from(fileOptions).filter(option => option.checked).map(option => option.value);
        const rulesValue = rules.value.trim();

        // Crear objeto con los datos del formulario
        const data = {
            institution: institutionValue,
            level: levelValue,
            description: descriptionValue,
            allowedFileTypes: allowedFileTypes,
            rules: rulesValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };

        try {
            // Almacenar los datos en Firestore
            const docRef = await db.collection("inscripciones").add(data);
            alert("Inscripción guardada exitosamente!");
            console.log("Documento escrito con ID: ", docRef.id);
        } catch (error) {
            console.error("Error al guardar inscripción: ", error);
        }
    });

    // Control de los botones "Siguiente"
    nextBtns[0].addEventListener('click', nextStep);
    nextBtns[1].addEventListener('click', nextStep);
    nextBtns[2].addEventListener('click', nextStep);
    nextBtns[3].addEventListener('click', nextStep);

    // Mostrar el primer paso al cargar
    showStep(currentStep);
});
