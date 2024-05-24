import { plot, Plot, Layout } from 'nodeplotlib'
import { ReadFlightDataCSV } from "../utils/fileReaders"
import { AIRPORT_IATAS } from '../utils/globals'

const coords: Record<string, [number, number]> = {
  ADL: [-34.92, 138.62],
  BNE: [-27.47, 153.03],
  CBR: [-35.28, 149.13],
  DRW: [-12.42, 130.89],
  HBA: [-42.84, 147.51],
  MEL: [-37.81, 144.96],
  PER: [-31.94, 115.97],
  SYD: [-33.87, 151.21]
}
const colours: Record<string, string> = {
  QF: 'red',
  VA: 'blue',
  JQ: 'orange',
}

const flightData = ReadFlightDataCSV().slice(1)

// calculate airline with highest average delay per unique trip
const toalDelays = flightData.reduce((acc, flight) => {
  if (flight.depAirport === flight.arrAirport) return acc
  const trip = `${flight.depAirport}-${flight.arrAirport}`
  const airline = flight.airline
  if (!acc[trip]) acc[trip] = {}
  if (!acc[trip][airline]) acc[trip][airline] = { totalDelay: 0, count: 0 }
  acc[trip][airline].totalDelay += flight.depDelay
  acc[trip][airline].count++
  return acc
}, {} as Record<string, Record<string, { totalDelay: number, count: number }>>)

// find the airline with highest average delay for each unique trip
const maxAvgDelay = Object.entries(toalDelays).reduce((acc, [trip, airlines]) => {
  const max = Object.entries(airlines).reduce((acc, [airline, { totalDelay, count }]) => {
    const avgDelay = totalDelay / count
    if (avgDelay > acc.avgDelay) return { airline, avgDelay }
    return acc
  }, { airline: '', avgDelay: 0 })
  acc[trip] = max
  return acc
}, {} as Record<string, { airline: string, avgDelay: number }>)

// console.log(Object.entries(maxAvgDelay).sort((a, b) => b[1].avgDelay - a[1].avgDelay))

for (const city of AIRPORT_IATAS) {
  const data = Object.entries(maxAvgDelay).filter(([trip]) => trip.startsWith(city))
  let showLegend = {
    QF: true,
    VA: true,
    JQ: true
  }

  plot(data.map(([trip, info], i) => {
    if (i === 0) showLegend = { QF: true, VA: true, JQ: true }
    const startCoords = coords[trip.split('-')[0]]
    const endCoords = coords[trip.split('-')[1]]
    const showlegend = showLegend[info.airline]
    showLegend[info.airline] = false
    return {
      type: 'scattergeo',
      locationmode: 'ISO-3',
      lon: [ startCoords[1] , endCoords[1] ],
      lat: [ startCoords[0] , endCoords[0] ],
      mode: 'text+lines+markers',
      line: {
        width: 2,
        color: colours[info.airline]
      },
      opacity: 1,
      text: ['', `${Math.floor(info.avgDelay)} mins`],
      textposition: 'top center',
      name: info.airline,
      showlegend
    }
  }), {
    title: `Airline with Longest Average Delay Departing from ${city}`,
    geo: {
      scope: 'oceania',
      projection: {
        type: 'azimuthal equal area'
      },
      lataxis: { range: [-45, -10] },
      lonaxis: { range: [112, 155] },
      showland: true,
      landcolor: 'rgb(243,243,243)',
      countrycolor: 'rgb(204,204,204)'
    }
  })
}