
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
    })
    .catch(error => console.error('Error al obtener los datos del JSON:', error));
