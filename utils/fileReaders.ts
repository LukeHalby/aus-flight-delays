import fs from 'fs';
import { tAirportWeatherData, tFlightData, tWeatherData } from './types';
import { FILE_PATH } from './globals';

export function ReadFlightDataCSV(): tFlightData[] {
  return fs.readFileSync(`${FILE_PATH}/flights.csv`, 'utf8')
    .split('\n')
    .map(line => {
      const [airline, flightNumber, depAirport, depDate, depHour, depDelay, arrAirport, arrDate, arrHour, arrDelay] = line.split(',');
      return {
        airline,
        flightNumber,
        depAirport,
        depDate,
        depHour,
        depDelay: parseInt(depDelay),
        arrAirport,
        arrDate,
        arrHour,
        arrDelay: parseInt(arrDelay)
      }
    });
}

export function ReadAirportWeatherDataCSV(airport: string): tAirportWeatherData {
  return Object.fromEntries(
    fs.readFileSync(`${FILE_PATH}/${airport}-weather.csv`, 'utf8')
      .split('\n')
      .map(line => {
        const [time,
          temperature_2m,
          precipitation,
          weather_code,
          cloud_cover_low,
          cloud_cover_mid,
          cloud_cover_high,
          wind_speed_10m,
          wind_speed_100m,
          wind_direction_10m,
          wind_direction_100m
        ] = line.split(',');
        return [time, {
          temperature_2m: parseInt(temperature_2m),
          precipitation: parseInt(precipitation),
          weather_code: parseInt(weather_code),
          cloud_cover_low: parseInt(cloud_cover_low),
          cloud_cover_mid: parseInt(cloud_cover_mid),
          cloud_cover_high: parseInt(cloud_cover_high),
          wind_speed_10m: parseInt(wind_speed_10m),
          wind_speed_100m: parseInt(wind_speed_100m),
          wind_direction_10m: parseInt(wind_direction_10m),
          wind_direction_100m: parseInt(wind_direction_100m)
        }]
      })
  )
}

export function ReadWeatherDataCSVs(): tWeatherData {
  const airports = fs.readdirSync(FILE_PATH)
    .filter(file => file.endsWith('-weather.csv'))
    .map(file => file.split('-weather.csv')[0]);

  const weatherData: tWeatherData = {};
  airports.forEach(airport => {
    weatherData[airport] = ReadAirportWeatherDataCSV(airport);
  });

  return weatherData;
}
