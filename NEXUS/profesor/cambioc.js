import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

const auth = getAuth();

// Función para cambiar la contraseña
async function changePassword(newPassword) {
  const user = auth.currentUser;

  if (user) {
    try {
      // Actualiza la contraseña
      await updatePassword(user, newPassword);
      alert("Contraseña actualizada con éxito.");
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        alert("Es necesario volver a autenticarse para cambiar la contraseña.");
        // Llama a la función de reautenticación si es necesario
        reauthenticateUser(user);
      } else {
        console.error("Error al cambiar la contraseña:", error.message);
        alert("Hubo un error al cambiar la contraseña.");
      }
    }
  } else {
    alert("No hay un usuario autenticado.");
  }
}

// Función para reautenticar al usuario
async function reauthenticateUser(user) {
  const email = prompt("Por favor, ingresa tu correo electrónico:");
  const currentPassword = prompt("Por favor, ingresa tu contraseña actual:");

  const credential = EmailAuthProvider.credential(email, currentPassword);

  try {
    await reauthenticateWithCredential(user, credential);
    alert("Reautenticación exitosa. Ahora puedes cambiar tu contraseña.");
  } catch (error) {
    console.error("Error al reautenticar:", error.message);
    alert("Error al reautenticar. Verifica tus credenciales.");
  }
}

// Escucha el evento del botón para cambiar la contraseña
document.getElementById("change-password-btn").addEventListener("click", async () => {
  const newPassword = document.getElementById("new-password").value;

  if (newPassword) {
    await changePassword(newPassword);
  } else {
    alert("Por favor, ingresa una nueva contraseña.");
  }
});