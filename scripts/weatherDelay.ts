import { plot, Plot } from 'nodeplotlib'
import { ReadFlightDataCSV, ReadWeatherDataCSVs } from '../utils/fileReaders'
import { filterOutliers } from '../utils/statistics'
import { AIRPORT_IATAS } from '../utils/globals'

const tempColours = [
  "#297eff", "#3483f3",
  "#4087e6", "#4b8cda",
  "#5691ce", "#6196c1",
  "#6d9ab5", "#789fa8",
  "#83a49c", "#8ea990",
  "#9aad83", "#a5b277",
  "#b0b76b", "#bbbc5e",
  "#c7c052", "#d2c545",
  "#ddca39", "#e8cf2d",
  "#f4d320", "#ffd814",
  "#ffd015", "#ffc816",
  "#ffc017", "#ffb818",
  "#ffb019", "#ffa81a",
  "#ffa01b", "#ff981c",
  "#ff901d", "#ff881e",
  "#ff811f", "#ff791f",
  "#ff7120", "#ff6921",
  "#ff6122", "#ff5923",
  "#ff5124", "#ff4925",
  "#ff4126", "#ff3927",
  "#ff3128", "#ff2929",
]

const flightData = ReadFlightDataCSV().slice(1)
const weatherData = ReadWeatherDataCSVs()
const type = 'box'

const flightDelayData = filterOutliers(
  filterOutliers(
    flightData.map(flight => {
      const depWeather = weatherData[flight.depAirport][`${flight.depDate}T${flight.depHour}:00`]
      const arrWeather = weatherData[flight.arrAirport][`${flight.arrDate}T${flight.arrHour}:00`]
      if (!depWeather) console.log(flight.depAirport, flight.depDate, flight.depHour)
      if (!arrWeather) console.log(flight.arrAirport, flight.arrDate, flight.arrHour)
      return {
        airline: flight.airline,
        depAirport: flight.depAirport,
        arrAirport: flight.arrAirport,
        depDelay: flight.depDelay,
        arrDelay: flight.arrDelay,
        depTemperature: depWeather.temperature_2m,
        arrTemperature: arrWeather.temperature_2m,
        depPrecipitation: depWeather.precipitation,
        arrPrecipitation: arrWeather.precipitation,
        depWindSpeed: depWeather.wind_speed_10m,
        arrWindSpeed: arrWeather.wind_speed_10m,
        depWindDirection: depWeather.wind_direction_10m,
        arrWindDirection: arrWeather.wind_direction_10m
      }
    }),
    "depDelay"
  ),
  "arrDelay"
)

const depDelays = flightDelayData.map(flight => flight.depDelay)
const arrDelays = flightDelayData.map(flight => flight.arrDelay)
const depTemperatures = flightDelayData.map(flight => flight.depTemperature)
const arrTemperatures = flightDelayData.map(flight => flight.arrTemperature)
const depPrecipitations = flightDelayData.map(flight => flight.depPrecipitation)
const arrPrecipitations = flightDelayData.map(flight => flight.arrPrecipitation)
const depWindSpeeds = flightDelayData.map(flight => flight.depWindSpeed)
const arrWindSpeeds = flightDelayData.map(flight => flight.arrWindSpeed)

const depDelayBoxes: Plot[] = [...(new Set(depTemperatures.map(temp => Math.floor(temp))))].sort((a, b) => a - b).map(temp => {
  const delays = flightDelayData.filter(flight => Math.floor(flight.depTemperature) === temp).map(flight => flight.depDelay)
  return {
    y: delays,
    type: 'box',
    name: `${temp}`,
    marker: {
      color: tempColours[temp]
    },
    boxpoints: false,
    showlegend: false
  }
})

const arrDelayBoxes: Plot[] = [...(new Set(arrTemperatures.map(temp => Math.floor(temp))))].sort((a, b) => a - b).map(temp => {
  const delays = flightDelayData.filter(flight => Math.floor(flight.arrTemperature) === temp).map(flight => flight.arrDelay)
  return {
    y: delays,
    type: 'box',
    name: `${temp}`,
    marker: {
      color: tempColours[temp]
    },
    boxpoints: false,
    showlegend: false
  }
})

const depPrecipitationPlot: Plot = {
  x: depPrecipitations,
  y: depDelays,
  type: type,
  name: 'Departure Delay vs Precipitation',
  boxpoints: false
}

const arrPrecipitationPlot: Plot = {
  x: arrPrecipitations,
  y: arrDelays,
  type: type,
  name: 'Arrival Delay vs Precipitation',
  boxpoints: false
}

const depWindSpeedPlot: Plot = {
  x: depWindSpeeds,
  y: depDelays,
  type: type,
  name: 'Departure Delay vs Wind Speed',
  boxpoints: false
}

const arrWindSpeedPlot: Plot = {
  x: arrWindSpeeds,
  y: arrDelays,
  type: type,
  name: 'Arrival Delay vs Wind Speed',
  boxpoints: false
}

plot(depDelayBoxes, { title: 'Departure Delay vs Temperature', xaxis: { title: 'Temperature (°C)' }, yaxis: { title: 'Delay (minutes)' }})
plot(arrDelayBoxes, { title: 'Arrival Delay vs Temperature', xaxis: { title: 'Temperature (°C)' }, yaxis: { title: 'Delay (minutes)' }})
plot([depPrecipitationPlot], { title: 'Departure Delay vs Precipitation', xaxis: { title: 'Precipitation (mm)' }, yaxis: { title: 'Delay (minutes)' }})
plot([arrPrecipitationPlot], { title: 'Arrival Delay vs Precipitation', xaxis: { title: 'Precipitation (mm)' }, yaxis: { title: 'Delay (minutes)' }})
plot([depWindSpeedPlot], { title: 'Departure Delay vs Wind Speed', xaxis: { title: 'Wind Speed (m/s)' }, yaxis: { title: 'Delay (minutes)' }})
plot([arrWindSpeedPlot], { title: 'Arrival Delay vs Wind Speed', xaxis: { title: 'Wind Speed (m/s)' }, yaxis: { title: 'Delay (minutes)' }})

for (const city of AIRPORT_IATAS) {
  const cityFlights = flightDelayData.filter(flight => flight.depAirport === city)
  const cityDepDelays = cityFlights.map(flight => flight.depDelay)
  const cityWindDirections = cityFlights.map(flight => flight.depWindDirection)

  // caclulate the average delay in 10 degree increments
  const degrees = Array.from(new Set(cityWindDirections.map(theta => Math.round(theta/10)*10))).sort((a, b) => a - b)
  const avgDelays = degrees.map(degree => {
    const delays = cityFlights.filter(flight => Math.round(flight.depWindDirection/10)*10 === degree).map(flight => flight.depDelay)
    return delays.reduce((a, b) => a + b, 0) / delays.length
  })
  
  plot([
    {
      type: "scatterpolargl",
      r: cityDepDelays,
      theta: cityWindDirections,
      mode: "markers",
      name: city,
      marker: {
        color: "rgb(14, 207, 91)",
        size: 2,
        line: {
          color: "white"
        },
        opacity: 0.4
      },
      showlegend: false,
      cliponaxis: false
    }, {
      type: "scatterpolargl",
      r: avgDelays,
      theta: degrees,
      mode: "lines",
      name: "10° Average",
      line: {
        color: "rgb(26, 179, 235)",
        width: 2,
        shape: "spline",
        smoothing: 1
      },
      fill: "toself",
      cliponaxis: false
    },
  ], {
    title: `${city} Departure Delay vs Wind Direction`,
    font: {
      size: 12
    },
    polar: {
      angularaxis: {
        tickwidth: 2,
        linewidth: 3,
        layer: "below traces",
        direction: "clockwise",
        tickmode: "array",
        tickvals: [0, 90, 180, 270],
        ticktext: ["N", "E", "S", "W"],
      },
      radialaxis: {
        side: "counterclockwise",
        showline: true,
        linewidth: 2,
        tickwidth: 2,
        gridcolor: "rgb(223, 223, 223)",
        gridwidth: 2
      }
    },
  })
}