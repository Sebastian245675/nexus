export function addDeleteButtons() {
    // Selecciona el contenedor principal donde están los estudiantes
    const studentsList = document.querySelector(".students-list");

    // Verifica que el contenedor existe
    if (!studentsList) {
        console.error("No se encontró el contenedor de la lista de estudiantes.");
        return;
    }

    // Selecciona todos los elementos que representan estudiantes
    const studentItems = studentsList.querySelectorAll(".student-item");

    // Itera sobre cada elemento de estudiante
    studentItems.forEach(function (studentItem) {
        // Verifica que no se haya agregado previamente un botón
        if (studentItem.querySelector(".delete-button")) {
            console.warn("El botón ya existe para este estudiante.");
            return;
        }

        // Crea el botón "Eliminar"
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.className = "delete-button";

        // Añade el botón al estudiante
        studentItem.appendChild(deleteButton);
    });
}