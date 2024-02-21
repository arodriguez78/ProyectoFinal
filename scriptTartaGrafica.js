  // Obtener los datos del JSON
  fetch('https://raw.githubusercontent.com/arodriguez78/ProyectoFinal/main/imdb_top_1000.json')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      // Crear un objeto para almacenar el número de películas por año
      const moviesByYear = {};

      // Contar las películas por año
      data.forEach(movie => {
          const year = movie.Released_Year.toString();
          if (moviesByYear[year]) {
              moviesByYear[year]++;
          } else {
              moviesByYear[year] = 1;
          }
      });

      // Configurar los datos para el gráfico de tarta
      const years = Object.keys(moviesByYear);
      const movieCounts = Object.values(moviesByYear);

      // Configurar el gráfico de tarta
      const chartDom = document.getElementById('pieChart');
      const chart = echarts.init(chartDom);
      const option = {
          title: {
              text: 'Número de Películas por Año',
              left: 'center'
          },
          tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
              orient: 'vertical',
              left: 'left',
              data: years
          },
          series: [
              {
                  name: 'Año',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '60%'],
                  data: years.map((year, index) => ({value: movieCounts[index], name: year})),
                  emphasis: {
                      itemStyle: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  }
              }
          ]
      };

      // Establecer opciones y renderizar el gráfico
      chart.setOption(option);
  })
  .catch(error => console.error('Error al obtener los datos del JSON:', error));