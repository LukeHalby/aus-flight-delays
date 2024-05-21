import { AIRPORT_IATAS } from "./globals";
import { tAviationStackFlightData } from "./types";

export function ValidFlightRecord(record: tAviationStackFlightData): boolean {
  // check for international flights
  if (!AIRPORT_IATAS.includes(record.arrival.iata)) return false
  
  return record.flight_status === "landed" && record.arrival.actual !== null
}