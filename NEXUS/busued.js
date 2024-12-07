// Obtén referencias a los elementos necesarios
const searchBox = document.querySelector('.search-box input');
const forumsList = document.getElementById('forums-list');
const forumItems = forumsList.getElementsByClassName('forum-item');

// Escucha el evento de entrada en el campo de búsqueda
searchBox.addEventListener('input', function() {
  const searchTerm = searchBox.value.toLowerCase(); // Convierte el término de búsqueda a minúsculas

  // Itera sobre los foros y muestra u oculta según el término de búsqueda
  Array.from(forumItems).forEach(function(forumItem) {
    const forumName = forumItem.textContent.toLowerCase(); // Obtiene el nombre del foro en minúsculas
    if (forumName.includes(searchTerm)) {
      forumItem.style.display = ''; // Muestra el foro si el término está presente
    } else {
      forumItem.style.display = 'none'; // Oculta el foro si no coincide
    }
  });
});