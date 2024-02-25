// Obtener los datos del JSON
fetch('https://raw.githubusercontent.com/arodriguez78/ProyectoFinal/main/imdb_top_1000.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Crear un objeto para almacenar los ingresos por año y contar las películas por año
        const grossByYear = {};
        const movieCountByYear = {};

        // Iterar sobre las películas y sumar los ingresos por año
        data.forEach(movie => {
            const year = movie.Released_Year.toString();
            const gross = parseFloat(movie.Gross.replace(/,/g, ''));

            // Actualizar los ingresos y contar las películas para el año actual
            if (grossByYear[year]) {
                grossByYear[year] += gross;
                movieCountByYear[year]++;
            } else {
                grossByYear[year] = gross;
                movieCountByYear[year] = 1;
            }
        });

        // Calcular la media de ingresos por año
        const years = Object.keys(grossByYear);
        const averageGrossByYear = years.map(year => grossByYear[year] / movieCountByYear[year]);

        // Configurar el gráfico de barras
        const chartDom = document.getElementById('barChart');
        const chart = echarts.init(chartDom);
        const option = {
            title: {
                text: 'Media de Ingresos por Año',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            
                    type: 'shadow'        
                }
            },
            xAxis: {
                type: 'category',
                data: years,
                axisLabel: {
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
                name: 'Media de Ingresos',
                axisLabel: {
                    formatter: '{value} $'
                }
            },
            series: [{
                data: averageGrossByYear,
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }]
        };

        // Establecer opciones y renderizar el gráfico
        chart.setOption(option);

        // Agregar evento de clic al gráfico de barras
        chart.on('click', params => {
            const year = params.name;
            const moviesOfYear = data.filter(movie => movie.Released_Year.toString() === year);
            // Mostrar las películas del año seleccionado en un div debajo de la grafica
            generateMovieCardsOfYear(moviesOfYear);
        });
    })
    .catch(error => console.error('Error al obtener los datos del JSON:', error));

    function generateMovieCardsOfYear(movies) {
        // Ordenar las películas por recaudación de mayor a menor
        movies.sort((a, b) => parseFloat(b.Gross.replace(/,/g, '')) - parseFloat(a.Gross.replace(/,/g, '')));
    
        // Limpiar contenido anterior
        const moviesOfYearContainer = document.getElementById('moviesOfYear');
        moviesOfYearContainer.innerHTML = '';
    
        // Mostrar las películas en cards
        movies.forEach(movie => {
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
    
            // Agregar director de la película
            const director = document.createElement('p');
            director.textContent = 'Director: ' + movie.Director;
            card.appendChild(director);
    
            // Agregar año de lanzamiento de la película
            const year = document.createElement('p');
            year.textContent = 'Año: ' + movie.Released_Year;
            card.appendChild(year);
    
            // Agregar rating de la película
            const rating = document.createElement('p');
            rating.textContent = 'Rating IMDB: ' + movie.IMDB_Rating;
            card.appendChild(rating);
    
            // Agregar género de la película
            const genre = document.createElement('p');
            genre.textContent = 'Género: ' + movie.Genre;
            card.appendChild(genre);
    
            // Agregar recaudación de la película
            const gross = document.createElement('p');
            gross.textContent = 'Recaudación: $' + movie.Gross;
            card.appendChild(gross);
    
            // Agregar sinopsis de la película
            const overview = document.createElement('p');
            overview.textContent = 'Sinopsis: ' + movie.Overview;
            card.appendChild(overview);
    
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
                        <p><strong>Recaudación:</strong> $${movie.Gross}</p>
                        <p><strong>Sinopsis:</strong> ${movie.Overview}</p>
                    </div>
                    <div class="uk-modal-footer uk-text-right">
                        <button class="uk-button uk-button-default uk-modal-close" type="button">Cerrar</button>
                    </div>
                `).show();
            });
    
            // Agregar la card al contenedor de películas
            cardDiv.appendChild(card);
            moviesOfYearContainer.appendChild(cardDiv);
        });
    }
    