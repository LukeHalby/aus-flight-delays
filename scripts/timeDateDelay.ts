import { plot, Plot } from 'nodeplotlib'
import { ReadFlightDataCSV } from '../utils/fileReaders'
import { filterOutliers } from '../utils/statistics'

const hourTicks = Array(24).fill(0).map((_, i) => i)
const dayTicks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const flightData = ReadFlightDataCSV().slice(1)

// const flightDelayData = filterOutliers(
//   filterOutliers(
//     flightData.map(flight => {
//       return {
//         airline: flight.airline,
//         depDelay: flight.depDelay,
//         arrDelay: flight.arrDelay,
//         depHour: parseInt(flight.depHour),
//         arrHour: parseInt(flight.arrHour),
//         depDate: (new Date(flight.depDate)).getDay(),
//         arrDate: (new Date(flight.arrDate)).getDay()
//       }
//     }),
//     "depDelay"
//   ),
//   "arrDelay"
// )

const flightDelayData = flightData.map(flight => {
  return {
    airline: flight.airline,
    depDelay: flight.depDelay,
    arrDelay: flight.arrDelay,
    depHour: parseInt(flight.depHour),
    arrHour: parseInt(flight.arrHour),
    depDate: (new Date(flight.depDate)).getDay(),
    arrDate: (new Date(flight.arrDate)).getDay()
  }
})

// get data and remove outliers
const airlines = flightDelayData.map(flight => flight.airline)
const depDelays = flightDelayData.map(flight => flight.depDelay)
const arrDelays = flightDelayData.map(flight => flight.arrDelay)
const depHours = flightDelayData.map(flight => flight.depHour)
const arrHours = flightDelayData.map(flight => flight.arrHour)
const depDays = flightDelayData.map(flight => flight.depDate)
const arrDays = flightDelayData.map(flight => flight.arrDate)

// calculate average delay per airline per hour
const qfAvgDepDelaysPerHour = depHours
  .reduce((acc, hour, i) => {
    if (airlines[i] !== 'QF') return acc
    if (!acc[hour]) acc[hour] = { totalDelay: 0, count: 0 }
    acc[hour].totalDelay += depDelays[i]
    acc[hour].count++
    return acc
  }, Array(24).fill({}).map(_ => ({ totalDelay: 0, count: 0 })))
  .map(hour => hour.totalDelay / hour.count)
const qfAvgArrDelaysPerHour = arrHours
  .reduce((acc, hour, i) => {
    if (airlines[i] !== 'QF') return acc
    if (!acc[hour]) acc[hour] = { totalDelay: 0, count: 0 }
    acc[hour].totalDelay += arrDelays[i]
    acc[hour].count++
    return acc
  }, Array(24).fill({}).map(_ => ({ totalDelay: 0, count: 0 })))
  .map(hour => hour.totalDelay / hour.count)

const vaAvgDepDelaysPerHour = depHours
  .reduce((acc, hour, i) => {
    if (airlines[i] !== 'VA') return acc
    if (!acc[hour]) acc[hour] = { totalDelay: 0, count: 0 }
    acc[hour].totalDelay += depDelays[i]
    acc[hour].count++
    return acc
  }, Array(24).fill({}).map(_ => ({ totalDelay: 0, count: 0 })))
  .map(hour => hour.totalDelay / hour.count)
const vaAvgArrDelaysPerHour = arrHours
  .reduce((acc, hour, i) => {
    if (airlines[i] !== 'VA') return acc
    if (!acc[hour]) acc[hour] = { totalDelay: 0, count: 0 }
    acc[hour].totalDelay += arrDelays[i]
    acc[hour].count++
    return acc
  }, Array(24).fill({}).map(_ => ({ totalDelay: 0, count: 0 })))
  .map(hour => hour.totalDelay / hour.count)

const jqAvgDepDelaysPerHour = depHours
  .reduce((acc, hour, i) => {
    if (airlines[i] !== 'JQ') return acc
    if (!acc[hour]) acc[hour] = { totalDelay: 0, count: 0 }
    acc[hour].totalDelay += depDelays[i]
    acc[hour].count++
    return acc
  }, Array(24).fill({}).map(_ => ({ totalDelay: 0, count: 0 })))
  .map(hour => hour.totalDelay / hour.count)
const jqAvgArrDelaysPerHour = arrHours
  .reduce((acc, hour, i) => {
    if (airlines[i] !== 'JQ') return acc
    if (!acc[hour]) acc[hour] = { totalDelay: 0, count: 0 }
    acc[hour].totalDelay += arrDelays[i]
    acc[hour].count++
    return acc
  }, Array(24).fill({}).map(_ => ({ totalDelay: 0, count: 0 })))
  .map(hour => hour.totalDelay / hour.count)


// calculate average delay per airline per day
const qfAvgDepDelaysPerDay = depDays
  .reduce((acc, day, i) => {
    if (airlines[i] !== 'QF') return acc
    if (!acc[day]) acc[day] = { totalDelay: 0, count: 0 }
    acc[day].totalDelay += depDelays[i]
    acc[day].count++
    return acc
  }, Array(24).fill({}).map(_ => ({ totalDelay: 0, count: 0 })))
  .map(day => day.totalDelay / day.count)
const qfAvgArrDelaysPerDay = arrDays
  .reduce((acc, day, i) => {
    if (airlines[i] !== 'QF') return acc
    if (!acc[day]) acc[day] = { totalDelay: 0, count: 0 }
    acc[day].totalDelay += arrDelays[i]
    acc[day].count++
    return acc
  }, Array(24).fill({}).map(_ => ({ totalDelay: 0, count: 0 })))
  .map(day => day.totalDelay / day.count)

const vaAvgDepDelaysPerDay = depDays
  .reduce((acc, day, i) => {
    if (airlines[i] !== 'VA') return acc
    if (!acc[day]) acc[day] = { totalDelay: 0, count: 0 }
    acc[day].totalDelay += depDelays[i]
    acc[day].count++
    return acc
  }, Array(24).fill({}).map(_ => ({ totalDelay: 0, count: 0 })))
  .map(day => day.totalDelay / day.count)
const vaAvgArrDelaysPerDay = arrDays
  .reduce((acc, day, i) => {
    if (airlines[i] !== 'VA') return acc
    if (!acc[day]) acc[day] = { totalDelay: 0, count: 0 }
    acc[day].totalDelay += arrDelays[i]
    acc[day].count++
    return acc
  }, Array(24).fill({}).map(_ => ({ totalDelay: 0, count: 0 })))
  .map(day => day.totalDelay / day.count)

const jqAvgDepDelaysPerDay = depDays
  .reduce((acc, day, i) => {
    if (airlines[i] !== 'JQ') return acc
    if (!acc[day]) acc[day] = { totalDelay: 0, count: 0 }
    acc[day].totalDelay += depDelays[i]
    acc[day].count++
    return acc
  }, Array(24).fill({}).map(_ => ({ totalDelay: 0, count: 0 })))
  .map(day => day.totalDelay / day.count)
const jqAvgArrDelaysPerDay = arrDays
  .reduce((acc, day, i) => {
    if (airlines[i] !== 'JQ') return acc
    if (!acc[day]) acc[day] = { totalDelay: 0, count: 0 }
    acc[day].totalDelay += arrDelays[i]
    acc[day].count++
    return acc
  }, Array(24).fill({}).map(_ => ({ totalDelay: 0, count: 0 })))
  .map(day => day.totalDelay / day.count)


const qfDepHourPlot: Plot = {
  x: hourTicks,
  y: qfAvgDepDelaysPerHour,
  type: 'scatter',
  mode: 'lines+markers',
  name: 'Qantas'
}
const qfArrHourPlot: Plot = {
  x: hourTicks,
  y: qfAvgArrDelaysPerHour,
  type: 'scatter',
  mode: 'lines+markers',
  name: 'Qantas'
}

const vaDepHourPlot: Plot = {
  x: hourTicks,
  y: vaAvgDepDelaysPerHour,
  type: 'scatter',
  mode: 'lines+markers',
  name: 'Virgin'
}
const vaArrHourPlot: Plot = {
  x: hourTicks,
  y: vaAvgArrDelaysPerHour,
  type: 'scatter',
  mode: 'lines+markers',
  name: 'Virgin'
}

const jqDepHourPlot: Plot = {
  x: hourTicks,
  y: jqAvgDepDelaysPerHour,
  type: 'scatter',
  mode: 'lines+markers',
  name: 'Jetstar'
}
const jqArrHourPlot: Plot = {
  x: hourTicks,
  y: jqAvgArrDelaysPerHour,
  type: 'scatter',
  mode: 'lines+markers',
  name: 'Jetstar'
}

const qfDepDayPlot: Plot = {
  x: dayTicks,
  y: qfAvgDepDelaysPerDay,
  type: 'scatter',
  mode: 'lines+markers',
  name: 'Qantas'
}
const qfArrDayPlot: Plot = {
  x: dayTicks,
  y: qfAvgArrDelaysPerDay,
  type: 'scatter',
  mode: 'lines+markers',
  name: 'Qantas'
}

const vaDepDayPlot: Plot = {
  x: dayTicks,
  y: vaAvgDepDelaysPerDay,
  type: 'scatter',
  mode: 'lines+markers',
  name: 'Virgin'
}
const vaArrDayPlot: Plot = {
  x: dayTicks,
  y: vaAvgArrDelaysPerDay,
  type: 'scatter',
  mode: 'lines+markers',
  name: 'Virgin'
}

const jqDepDayPlot: Plot = {
  x: dayTicks,
  y: jqAvgDepDelaysPerDay,
  type: 'scatter',
  mode: 'lines+markers',
  name: 'Jetstar'
}
const jqArrDayPlot: Plot = {
  x: dayTicks,
  y: jqAvgArrDelaysPerDay,
  type: 'scatter',
  mode: 'lines+markers',
  name: 'Jetstar'
}

plot([qfDepHourPlot, vaDepHourPlot, jqDepHourPlot], { title: 'Average Hourly Departure Delay By Airline', xaxis: { title: 'Hour', tickmode: 'array', tickvals: [0,3,6,9,12,15,18,21] }, yaxis: { title: 'Delay (minutes)' }})
plot([qfArrHourPlot, vaArrHourPlot, jqArrHourPlot], { title: 'Average Hourly Arrival Delay By Airline', xaxis: { title: 'Hour', tickmode: 'array', tickvals: [0,3,6,9,12,15,18,21] }, yaxis: { title: 'Delay (minutes)' } })
plot([qfDepDayPlot, vaDepDayPlot, jqDepDayPlot], { title: 'Average Daily Departure Delay By Airline', xaxis: { title: 'Day' }, yaxis: { title: 'Delay (minutes)' } })
plot([qfArrDayPlot, vaArrDayPlot, jqArrDayPlot], { title: 'Average Daily Arrival Delay By Airline', xaxis: { title: 'Day' }, yaxis: { title: 'Delay (minutes)' } })



const depHourPlot: Plot = {
  x: depHours,
  y: depDelays,
  type: 'box',
}

const arrHourPlot: Plot = {
  x: arrHours,
  y: arrDelays,
  type: 'box',
  boxpoints: false
}

const depDayPlot: Plot = {
  x: depDays,
  y: depDelays,
  type: 'box',
  boxpoints: false
}

const arrDayPlot: Plot = {
  x: arrDays,
  y: arrDelays,
  type: 'box',
  boxpoints: false
}

plot([depHourPlot], { title: 'Hourly Departure Delay', xaxis: { title: 'Hour', tickmode: 'array', tickvals: [0,3,6,9,12,15,18,21] }, yaxis: { title: 'Delay (minutes)' } })
plot([arrHourPlot], { title: 'Hourly Arrival Delay', xaxis: { title: 'Hour', tickmode: 'array', tickvals: [0,3,6,9,12,15,18,21] }, yaxis: { title: 'Delay (minutes)' } })
plot([depDayPlot], { title: 'Daily Departure Delay', xaxis: { title: 'Day', tickmode: 'array', tickvals: [0,1,2,3,4,5,6], ticktext: dayTicks }, yaxis: { title: 'Delay (minutes)' } })
plot([arrDayPlot], { title: 'Daily Arrival Delay', xaxis: { title: 'Day', tickmode: 'array', tickvals: [0,1,2,3,4,5,6], ticktext: dayTicks }, yaxis: { title: 'Delay (minutes)' } })