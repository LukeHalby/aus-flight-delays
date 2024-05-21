export type tFlightStatus = "scheduled" | "active" | "landed" | "cancelled" | "incident" | "diverted"

export type tAviationStackResponse<T> = {
  pagination: {
    limit: number,
    offset: number,
    count: number,
    total: number
  },
  error?: {
    code: string,
    message: string,
    context?: {
      [key: string]: { key: string, message: string }[]
    }
 }
  data: T[]
}

export type tAviationStackFlightData = {
  flight_status: tFlightStatus,
  flight_date: string,
  departure: {
      airport: string,
      timezone: string,
      iata: string,
      icao: string,
      terminal: string | null,
      gate: string | null,
      delay: number | null,
      scheduled: string,
      estimated: string,
      actual: string | null,
      estimated_runway: string | null,
      actual_runway: string | null
  },
  arrival: {
      airport: string,
      timezone: string,
      iata: string,
      icao: string,
      terminal: string | null,
      gate: string | null,
      baggage: string | null,
      delay: number | null,
      scheduled: string,
      estimated: string,
      actual: string | null,
      estimated_runway: string | null,
      actual_runway: string | null
  }
  airline: {
      name: string,
      iata: string,
      icao: string
  },
  flight: {
      number: string,
      iata: string,
      icao: string,
      codeshared: {
        airline_name: string,
        airline_iata: string,
        airline_icao: string,
        flight_number: string,
        flight_iata: string,
        flight_icao: string
      } | null
  },
  aircraft: {
      registration: string,
      iata: string,
      icao: string,
      icao24: string
  } | null,
  live: {
      updated: string,
      latitude: number,
      longitude: number,
      altitude: number,
      direction: number,
      speed_horizontal: number,
      speed_vertical: number,
      is_ground: boolean
  } | null
}

export type tAviationStackFlightDataRequest = {
  access_key: string,
  callback?: string,
  limit: string,
  offset?: string,
  flight_status?: tFlightStatus,
  flight_date?: string,
  dep_iata?: string,
  arr_iata?: string,
  dep_icao?: string,
  arr_icao?: string,
  airline_name?: string,
  airline_iata?: string,
  airline_icao?: string,
  flight_number?: string,
  flight_iata?: string,
  flight_icao?: string,
  min_delay_dep?: string,
  min_delay_arr?: string,
  max_delay_dep?: string,
  max_delay_arr?: string,
  arr_scheduled_time_arr?: string,
  arr_scheduled_time_dep?: string,
}

export type tFlightData = {
  airline: string,
  flightNumber: string,
  depAirport: string,
  depDate: string,
  depHour: string,
  depDelay: number,
  arrAirport: string,
  arrDate: string,
  arrHour: string,
  arrDelay: number
}

export type tAirportWeatherData = {
  [time: string]: {
    temperature_2m: number,
    precipitation: number,
    weather_code: number,
    cloud_cover_low: number,
    cloud_cover_mid: number,
    cloud_cover_high: number,
    wind_speed_10m: number,
    wind_speed_100m: number,
    wind_direction_10m: number,
    wind_direction_100m: number,
  }
}

export type tWeatherData = {
  [airport: string]: tAirportWeatherData
}