import { printCurrentWeather, printForecastFor8Days } from "./weatherAPI.js";
const city = process.argv[2];

const coords = await printCurrentWeather(city);
console.log(coords);
printForecastFor8Days(coords);
