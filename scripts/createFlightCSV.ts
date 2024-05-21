import fs from "fs"
import { DAY_MILLISECONDS, END_DATE_MILLISECONDS, FILE_PATH, START_DATE_MILLISECONDS } from "../utils/globals"
import { tAviationStackFlightData, tFlightData } from "../utils/types"
import { ValidFlightRecord } from "../utils/validation"

(async () => {
  let date = new Date(START_DATE_MILLISECONDS)
  const endDate = new Date(END_DATE_MILLISECONDS)
  let allFlights: tAviationStackFlightData[] = []
  let csvRecords: tFlightData[] = [
    {
      airline: 'airline',
      flightNumber: 'flightNumber',
      depAirport: 'depAirport',
      depDate: 'depDate',
      depHour: 'depHour',
      // @ts-expect-error
      depDelay: 'depDelay',
      arrAirport: 'arrAirport',
      arrDate: 'arrDate',
      arrHour: 'arrHour',
      // @ts-expect-error
      arrDelay: 'arrDelay'
    }
  ]
  while (date < endDate) {
    const dateString = date.toISOString().split('T')[0]
    date.setTime(date.getTime() + DAY_MILLISECONDS)

    console.log(`Reading ${dateString}.json`)
    const data = JSON.parse(fs.readFileSync(`${FILE_PATH}/${dateString}.json`, 'utf8')) as tAviationStackFlightData[]
    allFlights = [...allFlights, ...data]
  }

  console.log('Filtering and formatting data')
  allFlights.forEach(flight => {
    if (!ValidFlightRecord(flight)) return
    csvRecords.push({
      airline: flight.airline.iata,
      flightNumber: flight.flight.iata,
      depAirport: flight.departure.iata,
      depDate: flight.departure.actual!.split('T')[0],
      depHour: flight.departure.actual!.split('T')[1].split(':')[0],
      depDelay: flight.departure.delay || (new Date(flight.departure.actual!).getTime() - new Date(flight.departure.scheduled).getTime()) / 60000,
      arrAirport: flight.arrival.iata,
      arrDate: flight.arrival.actual!.split('T')[0],
      arrHour: flight.arrival.actual!.split('T')[1].split(':')[0],
      arrDelay: flight.arrival.delay || (new Date(flight.arrival.actual!).getTime() - new Date(flight.arrival.scheduled).getTime()) / 60000
    })
  })

  console.log('Writing to flights.csv')
  const csv = csvRecords.map(record => Object.values(record).join(',')).join('\n')
  fs.writeFileSync(`${FILE_PATH}/flights.csv`, csv)
})()