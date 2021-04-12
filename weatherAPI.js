import axios from "axios";
import { OPEN_WEATHER_MAP_API_KEY } from "./credentials.js";
import Table from "cli-table3";
import { DateTime } from "luxon";
import chalk from "chalk";

async function getData(url) {
  try {
    const response = await axios.get(url);
    let data = response.data;
    return data;
  } catch (error) {
    const errorMessage = {
      401: "API key este incorecta. Va rugam sa verificati fisierul credentials.js",
      404: "Va rugam sa verificat daca ati introdus numele orasului corect",
      429: "Ati depasit limita de cerere catre OpenWeather",
      500: "Ne pare rau, serverul este ratat",
      ENOTFOUND:
        "Nu exista o conexiune la internet. Esti ciumadan, plateste netul",
      get EAI_AGAIN() {
        return this.ENOTFOUND;
      },
    };

    const errorCode = error.code ?? Number(error.response.data.cod);
    console.log(chalk.red.bgYellow.bold(errorMessage[errorCode]));
    process.exit();
  }
}
/**
 * @typedef Coords
 * @property {number} lat - geographical latitude
 * @property {number} lon - geographical longitude
 */
/**
 * Prints current weather condition
 * @param {String} cityName -
 *                 name of city.optional "City,(State),Country".(Use ISO cod)
 * @returns {Coords} geographical coordinates of the city
 */

export async function printCurrentWeather(cityName) {
  const OPEN_WEATHER_MAP_API =
    `http://api.openweathermap.org/data/2.5/weather?q=${cityName}` +
    `&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;
  const data = await getData(OPEN_WEATHER_MAP_API);
  console.log(
    `În ${data.name} se prognozeaza ${data.weather[0].description}.  ` +
      `\nTemperatura curentă este de ${data.main.temp}°C.`
  );
  return data.coord;
}

/**
 * Prints weather forecast for 8 days
 * @param {Coords} coords - geographical coordinates of a location
 */

export async function printForecastFor8Days({ lon, lat }) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}` +
    `&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;
  const data = await getData(OPEN_WEATHER_MAP_API);
  let table = new Table({
    head: ["Data", "Temp max.", "Temp min.", "Viteza vantului"],
  });
  const dailyData = data.daily;
  console.log(dailyData);
  dailyData.forEach((dayData) => {
    const date = DateTime.fromSeconds(dayData.dt);
    const arr = [
      date.setLocale("ro").toLocaleString(DateTime.DATE_MED),
      dayData.dt,
      dayData.temp.max,
      dayData.temp.min,
      dayData.wind_speed,
    ];
    table.push(arr);
  });
  console.log(table.toString());
}
