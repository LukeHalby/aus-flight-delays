(async () => {
  const fs = require("fs")
  const FILE_PATH = "./data"
  const FILE_NAME = "test.json"
  const API_URL = "https://api.aviationstack.com/v1/flights"
  const API_KEY = "7d14b730054da84875a16695fa1ff752"
  const params = new URLSearchParams({
    access_key: API_KEY,
    limit: 100,
    flight_date: "2024-03-01",
    dep_iata: "BNE",
  })

  try {
    const response = await fetch(`${API_URL}?${params}`)
    const data = await response.json()

    if (data.error) {
      console.error("API Error:", data.error)
    } else {
      fs.writeFileSync(`${FILE_PATH}/${FILE_NAME}`, JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.error("Caught Error:", error)
  }
})()