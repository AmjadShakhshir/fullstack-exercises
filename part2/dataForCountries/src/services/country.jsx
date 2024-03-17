import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";

const getAll = async () => {
  const request = axios.get(`${baseUrl}/api/all`);
  return request.then((response) => response.data);
};

const getOne = async (name) => {
  const request = axios.get(`${baseUrl}/api/name/${name}`);
  return request.then((response) => response.data);
};

const getWeather = async (api_key, capital) => {
  const request = axios.get(`${weatherUrl}?q=${capital}&appid=${api_key}&units=metric`);
  return request.then((response) => response.data);
};

export default {
  getAll,
  getOne,
  getWeather,
};
