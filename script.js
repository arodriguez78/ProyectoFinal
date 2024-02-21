// Variables globales para la paginación
let currentPage = 1;
const moviesPerPage = 12;

// Función para generar las cards de películas
// Función para generar las cards de películas
// Función para generar las cards de películas
function generateMovieCards(movieData, page) {
    const peliculasContainer = document.getElementById('peliculasContainer');
    peliculasContainer.innerHTML = ''; // Limpiar contenido anterior

    // Calcular el índice de inicio y fin de las películas a mostrar en la página actual
    const startIndex = (page - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;

    // Iterar sobre las películas y generar las cards para la página actual
    for (let i = startIndex; i < endIndex && i < movieData.length; i++) {
        const movie = movieData[i];

        // Crear un div de columna
        const columnDiv = document.createElement('div');
        columnDiv.classList.add('uk-width-1-4@s', 'uk-width-1-3@m');

        const card = document.createElement('div');
        card.classList.add('uk-card', 'uk-card-default', 'uk-card-body', 'uk-margin');

        // Agregar contenido a la tarjeta (imagen, título, director, fecha)
        // Aquí solo se muestra la imagen y el título, el resto se mostrará en el modal
        const img = document.createElement('img');
        img.classList.add('uk-align-center');
        img.src = movie.Poster_Link;
        img.alt = movie.Series_Title;
        card.appendChild(img);

        const title = document.createElement('h3');
        title.textContent = movie.Series_Title;
        card.appendChild(title);

        // Agregar evento de clic a la tarjeta para abrir el modal con la información completa
        card.addEventListener('click', function() {
            openMovieModal(movie);
        });

        // Agregar la tarjeta al div de columna
        columnDiv.appendChild(card);
        
        // Agregar la columna al contenedor principal de películas
        peliculasContainer.appendChild(columnDiv);
    }

    // Recrear la cuadrícula después de agregar las tarjetas
    UIkit.grid('#peliculasContainer');
}


// Función para abrir el modal con la información completa de la película
function openMovieModal(movie) {
    const modal = UIkit.modal.dialog(`
        <div class="uk-modal-body">
            <img class="uk-align-center" src="${movie.Poster_Link}" alt="${movie.Series_Title}">
            <h2>${movie.Series_Title}</h2>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Fecha:</strong> ${movie.Released_Year}</p>
            <p><strong>Rating IMDB:</strong> ${movie.IMDB_Rating}</p>
            <p><strong>Género:</strong> ${movie.Genre}</p>
            <p><strong>Sinopsis:</strong> ${movie.Overview}</p>
        </div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cerrar</button>
        </div>
    `);
    modal.show();
}



// Función para generar la paginación
function generatePagination(movieData) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Limpiar contenido anterior

    // Calcular el número total de páginas
    const totalPages = Math.ceil(movieData.length / moviesPerPage);

    // Generar botones de paginación para cada página
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#">${i}</a>`;
        li.addEventListener('click', function() {
            currentPage = i;
            generateMovieCards(movieData, currentPage);
            updateActivePage();
        });
        paginationContainer.appendChild(li);
    }

    // Marcar la página actual como activa
    updateActivePage();
}

// Función para marcar la página actual como activa
function updateActivePage() {
    const paginationContainer = document.getElementById('pagination');
    const pages = paginationContainer.querySelectorAll('li');
    pages.forEach((page, index) => {
        if (index + 1 === currentPage) {
            page.classList.add('uk-active');
        } else {
            page.classList.remove('uk-active');
        }
    });
}

// Obtener los datos del JSON
fetch('https://raw.githubusercontent.com/arodriguez78/ProyectoFinal/main/imdb_top_1000.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Generar la paginación
        generatePagination(data);
        // Generar las cards de las películas para la página actual
        generateMovieCards(data, currentPage);
    })
    .catch(error => console.error('Error al obtener los datos:', error));
