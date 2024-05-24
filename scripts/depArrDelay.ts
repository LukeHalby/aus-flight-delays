import { plot, Plot, Layout } from 'nodeplotlib'
import { ReadFlightDataCSV } from '../utils/fileReaders'
import { filterOutliers } from '../utils/statistics'

const flightData = ReadFlightDataCSV().slice(1)

const flightDelayData = filterOutliers(
  filterOutliers(
    flightData.map(flight => {
      return {
        airline: flight.airline,
        depDelay: flight.depDelay,
        arrDelay: flight.arrDelay,
      }
    }),
    "depDelay"
  ),
  "arrDelay"
)

// get data and remove outliers
const airlines = flightDelayData.map(flight => flight.airline)
const depDelays = flightDelayData.map(flight => flight.depDelay)
const arrDelays = flightDelayData.map(flight => flight.arrDelay)

// const depArrDelayPlot: Plot = {
//   x: depDelays,
//   y: arrDelays,
//   mode: 'markers',
//   type: 'scatter',
//   name: 'Departure Delay vs Arrival Delay'
// }

// plot([depArrDelayPlot], { title: 'Departure Delay vs Arrival Delay', xaxis: { title: 'Departure Delay (minutes)' }, yaxis: { title: 'Arrival Delay (minutes)' } })

var trace1: Plot = {
  x: depDelays,
  y: arrDelays,
  mode: 'markers',
  name: 'points',
  marker: {
    color: 'rgb(102,0,0)',
    size: 2,
    opacity: 0.1
  },
  type: 'scatter'
};

var trace2: Plot = {
  x: depDelays,
  y: arrDelays,
  name: 'density',
  colorscale: 'Hot',
  reversescale: true,
  showscale: false,
  type: 'histogram2dcontour'
};

var trace3: Plot = {
  x: depDelays,
  name: 'x density',
  marker: {color: 'rgb(102,0,0)'},
  yaxis: 'y2',
  type: 'histogram'
};

var trace4: Plot = {
  y: arrDelays,
  name: 'y density',
  marker: {color: 'rgb(102,0,0)'},
  xaxis: 'x2',
  type: 'histogram'
};

var data = [trace2, trace3, trace4];

var layout: Layout = {
  showlegend: false,
  autosize: false,
  width: 600,
  height: 550,
  margin: {t: 50},
  hovermode: 'closest',
  bargap: 0,
  title: 'Departure Delay vs Arrival Delay',
  xaxis: {
    domain: [0, 0.75],
    tickmode: 'array',
    tickvals: [-20, 0, 20, 40, 60],
    title: 'Departure Delay (minutes)'
  },
  yaxis: {
    domain: [0, 0.75],
    title: 'Arrival Delay (minutes)'
  },
  xaxis2: {
    domain: [0.75, 1],
    showgrid: false,
    zeroline: false,
    title: 'Departures'
  },
  yaxis2: {
    domain: [0.75, 1],
    showgrid: false,
    zeroline: false,
    title: 'Arrivals'
  }
};

plot(data, layout);