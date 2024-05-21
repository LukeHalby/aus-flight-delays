import fs from "fs"
import { AIRLINE_IATAS, AIRPORT_IATAS, API_KEY, DAY_MILLISECONDS, FILE_NAME, FILE_PATH, START_DATE_MILLISECONDS } from "../utils/globals"
import { tFlightData, tFlightDataRequest } from "../utils/types"
import { GetFlightData } from "../utils/request"

const checkFileExists = async (s: string) => {return new Promise(r=>fs.access(s, fs.constants.F_OK, e => r(!e)))}

(async () => {
  let date = new Date(START_DATE_MILLISECONDS)
  let count = 0
  while (date.getTime() < Date.now()) {
    const dateString = date.toISOString().split('T')[0]
    date.setTime(date.getTime() + DAY_MILLISECONDS)

    if (await checkFileExists(`${FILE_PATH}/${dateString}.json`)) {
      console.log(dateString, 'done')
      continue
    }

    let data: tFlightData[] = []
    for (const depAirport of AIRPORT_IATAS) {
      for (const airline of AIRLINE_IATAS) {
        console.log(dateString, depAirport, airline)
        try {
          const params: tFlightDataRequest = {
            access_key: API_KEY || '',
            limit: "100",
            flight_date: dateString,
            flight_status: "landed",
            dep_iata: depAirport,
            airline_iata: airline
          }
          
          const newData = await GetFlightData(params)
          if (!newData) throw new Error('Data undefined')

          data = [...data, ...newData]
        } catch(e) {
          console.error(e)
          console.log('NEW START DATE', date.getTime())
        }
      }
    }

    fs.writeFileSync(`${FILE_PATH}/${dateString}.json`, JSON.stringify(data, null, 2))

    
    // if (++count > 1) break; // remove when finished testing
  }
})()