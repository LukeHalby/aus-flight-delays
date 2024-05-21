import { API_URL } from "./globals"
import { tAviationStackResponse, tAviationStackFlightData, tAviationStackFlightDataRequest } from "./types"

export async function GetFlightData(params: tAviationStackFlightDataRequest): Promise<tAviationStackFlightData[] | undefined> {
  let data: tAviationStackFlightData[] = []
  try {
    let retryLimit = 0
    let offset = 0
    do {
      // console.log('Page', offset/parseInt(params.limit) + 1)

      params.offset = offset.toString()
      const res = await fetch(`${API_URL}?${(new URLSearchParams(params))}`)
      const resData = (await res.json()) as tAviationStackResponse<tAviationStackFlightData>
      
      if (resData.error) {
        console.log(resData.error.code, '- retry attempt', retryLimit + 1)
        retryLimit++
        continue
      } 

      data = [...data, ...resData.data]
      if (resData.pagination.offset + resData.pagination.count >= resData.pagination.total) break;

      offset += parseInt(params.limit)
    } while (retryLimit < 5)
  } catch(e) {
    console.error(e)
    return undefined
  }
  return data
}