// Datos de películas (para mostrar cuando se hace clic en un año del gráfico)
let movieData;

// Obtener el contenedor de las películas
const moviesContainer = document.getElementById('moviesContainer');

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
        card.style.width = '100%';
        card.style.maxWidth = '300px'; // Anchura máxima de la tarjeta
        card.style.border = '1px solid #ccc';
        card.style.borderRadius = '5px';
        card.style.overflow = 'hidden'; // Ocultar contenido que exceda la tarjeta
        card.style.transition = 'transform 0.3s ease-in-out'; // Animación al pasar el ratón por encima

        // Agregar imagen de la película
        const img = document.createElement('img');
        img.classList.add('uk-align-center');
        img.src = movie.Poster_Link;
        img.alt = movie.Series_Title;
        img.style.width = '100%'; // Ajustar la imagen al ancho de la tarjeta
        img.style.height = 'auto'; // Permitir que la altura se ajuste automáticamente
        img.style.display = 'block'; // Evitar el espacio debajo de la imagen
        card.appendChild(img);

        // Agregar título de la película
        const title = document.createElement('h3');
        title.textContent = movie.Series_Title;
        title.style.marginTop = '0';
        title.style.marginBottom = '10px';
        title.style.fontSize = '18px';
        card.appendChild(title);

        // Agregar recaudación de la película
        const gross = document.createElement('p');
        gross.textContent = 'Recaudación: ' + movie.Gross;
        gross.style.marginBottom = '0';
        gross.style.color = '#888';
        gross.style.fontSize = '14px';
        card.appendChild(gross);

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

        // Estilos al pasar el ratón por encima
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)'; // Mover ligeramente hacia arriba
            card.style.boxShadow = '0px 5px 15px rgba(0, 0, 0, 0.1)'; // Sombra
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)'; // Volver a la posición original
            card.style.boxShadow = 'none'; // Quitar la sombra
        });

        // Agregar la card al contenedor de películas
        cardDiv.appendChild(card);
        moviesContainer.appendChild(cardDiv);
    });
}


// Función para inicializar el gráfico de barras
function initBarChart() {
    // Obtener el contenedor del gráfico de barras
    const barChartContainer = document.getElementById('barChart');

    // Inicializar el gráfico de barras
    const barChart = echarts.init(barChartContainer);

    // Configuración del gráfico de barras
    const option = {
        title: {
            text: 'Media de Ingresos por Año',
            left: 'center', // Alineación centrada del título
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
        },
        xAxis: {
            type: 'category',
            data: [], // Se llenará dinámicamente
            axisLabel: {
                rotate: 45,
            },
        },
        yAxis: {
            type: 'value',
            name: 'Media de Ingresos',
            axisLabel: {
                formatter: '{value} $',
            },
        },
        series: [
            {
                type: 'bar',
                itemStyle: {
                    color: '#6a99d8',
                },
                emphasis: {
                    itemStyle: {
                        color: '#2a5caa',
                    },
                },
                data: [], // Se llenará dinámicamente
            },
        ],
    };

    // Cargar datos dinámicos al gráfico de barras
    const years = Object.keys(getAverageGrossByYear());
    const averageGross = years.map(year => getAverageGrossByYear()[year]);
    option.xAxis.data = years;
    option.series[0].data = averageGross;

    // Renderizar el gráfico de barras
    barChart.setOption(option);

    // Agregar evento de clic en una barra del gráfico de barras
    barChart.on('click', ({ dataIndex }) => {
        const selectedYear = option.xAxis.data[dataIndex];
        generateMovieCards(selectedYear);
    });
}

// Obtener la media de ingresos por año
function getAverageGrossByYear() {
    const grossByYear = {};
    const movieCountByYear = {};

    movieData.forEach(movie => {
        const year = movie.Released_Year.toString();
        const gross = parseFloat(movie.Gross.replace(/,/g, ''));

        if (grossByYear[year]) {
            grossByYear[year] += gross;
            movieCountByYear[year]++;
        } else {
            grossByYear[year] = gross;
            movieCountByYear[year] = 1;
        }
    });

    const years = Object.keys(grossByYear);
    const averageGrossByYear = {};

    years.forEach(year => {
        averageGrossByYear[year] = grossByYear[year] / movieCountByYear[year];
    });

    return averageGrossByYear;
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
        // Inicializar el gráfico de barras
        initBarChart();
    })
    .catch(error => console.error('Error fetching movie data:', error));
