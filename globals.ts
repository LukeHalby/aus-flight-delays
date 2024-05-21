import 'dotenv/config'

export const FILE_PATH = "./data"
export const FILE_NAME = "test.json"
export const API_URL = "https://api.aviationstack.com/v1/flights"
export const API_KEY = process.env.API_KEY
export const START_DATE_MILLISECONDS = 1708387200000 // 20/02/2024
export const DAY_MILLISECONDS = 1000* 60 * 60 * 24
export const AIRLINE_IATAS = ["QF", "VA", "JQ"]
export const AIRPORT_IATAS = ["ADL", "BNE", "CBR", "DRW", "HBA", "MEL", "PER", "SYD"]