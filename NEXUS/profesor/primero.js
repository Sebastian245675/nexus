function showContent(section) {
    // Oculta todas las secciones
    document.querySelectorAll('.content-section').forEach((el) => el.classList.remove('active'));
    // Muestra la sección seleccionada
    document.getElementById(section).classList.add('active');
    // Cambia el título
    document.getElementById('sectionTitle').textContent = section.charAt(0).toUpperCase() + section.slice(1);
  }
  
  function navigateToNextPage() {
    // Redirige a otra página (puedes personalizar la URL aquí)
    window.location.href = "next-page.html";
  }
  document.getElementById('opciones').addEventListener('change', function() {
      // Oculta todas las secciones de contenido
      document.querySelectorAll('.content-section').forEach((section) => {
          section.classList.remove('active');
          section.classList.add('hidden');
      });
  
      // Obtiene la opción seleccionada
      const opcionSeleccionada = this.value;
  
      // Muestra la sección correspondiente
      if (opcionSeleccionada) {
          document.getElementById(opcionSeleccionada).classList.add('active');
      }
  });