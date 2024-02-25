// Datos de películas (para mostrar cuando se hace clic en un año del gráfico)
let movieData;

// Obtener el contenedor de las películas
const moviesContainer = document.getElementById('moviesContainer');

// Función para generar las cards de películas
// Función para generar las cards de películas
function generateMovieCards(year) {
    // Limpiar contenido anterior
    moviesContainer.innerHTML = '';

    // Filtrar las películas por el año seleccionado
    const moviesOfYear = movieData.filter(movie => movie.Released_Year == year);

    // Mostrar las películas en cards
    moviesOfYear.forEach(movie => {
        // Crear la estructura de la card
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('uk-width-1-4@s', 'uk-width-1-3@m');

        const card = document.createElement('div');
        card.classList.add('uk-card', 'uk-card-default', 'uk-card-body', 'uk-margin');

        // Agregar imagen de la película
        const img = document.createElement('img');
        img.classList.add('uk-align-center');
        img.src = movie.Poster_Link;
        img.alt = movie.Series_Title;
        card.appendChild(img);

        // Agregar título de la película
        const title = document.createElement('h3');
        title.textContent = movie.Series_Title;
        card.appendChild(title);

        // Agregar evento de clic para mostrar la información completa de la película
        card.addEventListener('click', () => {
            UIkit.modal.dialog(`
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
            `).show();
        });

        // Agregar la card al contenedor de películas
        cardDiv.appendChild(card);
        moviesContainer.appendChild(cardDiv);
    });
}


// Función para inicializar el gráfico de tarta
function initPieChart() {
    // Obtener el contenedor del gráfico de tarta
    const pieChartContainer = document.getElementById('pieChart');

    // Inicializar el gráfico de tarta
    const pieChart = echarts.init(pieChartContainer);

    // Configuración del gráfico de tarta
    const option = {
        title: {
            text: 'Número de Películas por Año',
            left: 'center', // Alineación centrada del título
            top: '5%', // Distancia desde el borde superior
            textStyle: {
                color: '#fff', // Color del texto del título
                fontSize: 24, // Tamaño de fuente del título
            },
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        series: [
            {
                name: 'Películas',
                type: 'pie',
                radius: ['40%', '60%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '16',
                        fontWeight: 'bold',
                    },
                },
                labelLine: {
                    show: false,
                },
                data: [],
            },
        ],
    };

    // Cargar datos dinámicos al gráfico de tarta
    const years = Object.keys(getMoviesByYear());
    const data = years.map(year => ({ value: getMoviesByYear()[year], name: year }));
    option.series[0].data = data;

    // Renderizar el gráfico de tarta
    pieChart.setOption(option);

    // Agregar evento de clic en un elemento del gráfico de tarta
    pieChart.on('click', ({ data: { name } }) => {
        generateMovieCards(name);
    });
}

// Obtener las películas agrupadas por año
function getMoviesByYear() {
    const moviesByYear = {};
    movieData.forEach(movie => {
        if (!moviesByYear[movie.Released_Year]) {
            moviesByYear[movie.Released_Year] = 1;
        } else {
            moviesByYear[movie.Released_Year]++;
        }
    });
    return moviesByYear;
}

// Obtener los datos del JSON de películas
fetch('https://raw.githubusercontent.com/arodriguez78/ProyectoFinal/main/imdb_top_1000.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        movieData = data;
        // Inicializar el gráfico de tarta
        initPieChart();
    })
    .catch(error => console.error('Error fetching movie data:', error));
