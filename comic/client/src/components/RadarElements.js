// define the options parameter for Apex radar charts in PowerCompete.js

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
      /* define x labels in the order of powers 
      sorted alphabetically as in the query output*/
      categories: ['Combat', 'Durability', 'Intelligence', 'Power', 'Speed', 'Strength'],
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
      max: 100,
      /* disable y aixs ticks since we used 
      markers to show the actual numbers*/
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


// define the options parameter for Apex grouped bar charts in PowerCompete.js

let option_bar = {
  options: {
    chart: {
      type: 'bar',
      height: 430
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'top',
        },
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },
    title: {
      text: 'Compare to Average'
      
    },
    colors: ['#b96df7', '#912323'],
    stroke: {
      show: true,
      width: 1,
      colors: ['#fff']
    },
    tooltip: {
      shared: true,
      intersect: false
    },
    labels: ['Combat', 'Durability', 'Intelligence', 'Power', 'Speed', 'Strength'],
    xaxis: {
      categories: ['Intelligence', 'Strength', 'Speed', 'Durability', 'Power', 'Combat'],
      show: false,
      rotate: -45,
      labels: {
        style: {
            colors: [],
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-xaxis-label',
        }},
      axisTicks: {
        show: false
    }



}}};



  export {options, option_bar};