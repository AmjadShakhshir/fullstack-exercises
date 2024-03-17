import { useState, useEffect } from "react";

import country from "../services/country";

const Weather = ({ capital, api_key }) => {
  const [weather, setWeather] = useState({});
  useEffect(() => {
    country.getWeather(api_key, capital).then((data) => {
      setWeather(data);
    });
  }, [api_key, capital]);
  return (
    <div>
      <p>Weather</p>
      <p>temperature: {weather.main?.temp} Celsius</p>
      <img height={100} width={100} src={`http://openweathermap.org/img/wn/${weather.weather?.[0].icon}.png`} alt="weather icon" />
      <p>wind: {weather.wind?.speed} m/s</p>
    </div>
  );
};

export default Weather;
