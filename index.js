(async () => {
  const fs = require("fs")

  const FILE_PATH = "./data"
  const FILE_NAME = "test.json"
  const API_URL = "https://api.aviationstack.com/v1/flights"
  const API_KEY = "7d14b730054da84875a16695fa1ff752"
  const START_DATE_SECONDS = 1709251200
  const DAY_SECONDS = 60 * 60 * 24
  const AIRLINE_IATAS = ["QF", "VA", "JQ"]
  const AIRPORT_IATAS = ["ADL", "BNE", "CBR", "DRW", "HBA", "MEL", "PER", "SYD"]

  let date = new Date(START_DATE_SECONDS * 1000)
  for (let i=0; i<=2; i++) {
    try {
      const dateString = date.toISOString().split('T')[0]
      const params = new URLSearchParams({
        access_key: API_KEY,
        limit: 100,
        flight_date: dateString,
        dep_iata: "BNE",
      })
      
      console.log('Starting', dateString)
      const response = await fetch(`${API_URL}?${params}`)
      const data = await response.json()
      console.log('Request Done')
  
      if (data.error) {
        console.error("API Error:", data.error)
      } else {
        fs.writeFileSync(`${FILE_PATH}/${dateString}-${FILE_NAME}`, JSON.stringify(data, null, 2))
        console.log('Writing Done')
      }
    } catch (error) {
      console.error("Caught Error:", error)
    }
    date.setTime(date.getTime() + DAY_SECONDS * 1000)
  }
})()