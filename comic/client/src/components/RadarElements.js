let options = {
    chart: {
      height: 150,
      type: 'radar',
    },
    dataLabels: {
      enabled: true
    },
    plotOptions: {
      radar: {
        size: 140,
        polygons: {
          strokeColors: '#e9e9e9',
          fill: {
            colors: ['#f8f8f8', '#fff']
          }
        }
      }
    },
    title: {
      text: 'Power Dimension Matrix'
      
    },
    colors: ['#b96df7'],
    markers: {
      size: 0,
      colors: ['#fff'],
      strokeColor: '#b96df7',
      strokeWidth: 2,
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val
        }
      }
    },
    xaxis: {
      categories: ['Intelligence', 'Strength', 'Speed', 'Durability', 'Power', 'Combat'],
      labels: {
        style: {
            colors: [],
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-xaxis-label',
        }
        },
    },
    yaxis: {
      tickAmount: 6,
      show: false,
      showAlways: false,
      showForNullSeries: false,
      labels: {
        show: false,
        showAlways: false,
        showForNullSeries: false,
        formatter: function(val, i) {
          if (i % 201212312 === 0) {
            return val
          } else {
            return ''
          }
        }
      }
    }
  };


  export {options};