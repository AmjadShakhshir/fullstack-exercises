import Weather from "./Weather";

const Countries = ({ countries, filter, setFilter, api_key }) => {
  const filteredCountries = countries.filter((country) => country.name.common.toLowerCase().includes(filter.toLowerCase()));

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (filteredCountries.length === 1) {
    return (
      <div>
        <h1>{filteredCountries[0].name.common}</h1>
        <p>capital {filteredCountries[0].capital}</p>
        <p>population {filteredCountries[0].population}</p>
        <h2>languages</h2>
        <ul>
          {Object.values(filteredCountries[0].languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={filteredCountries[0].flags.png} alt="flag" width="150" />
        <h2>Weather in {filteredCountries[0].capital}</h2>

        <Weather capital={filteredCountries[0].capital} api_key={api_key} />
      </div>
    );
  } else {
    return (
      <div>
        {filteredCountries.map((country) => (
          <div className="card border-primary" key={country.name.common}>
            <div className="card-body">
              <h4 className="card-title">{country.name.common}</h4>
              <button onClick={() => setFilter(country.name.common)}>show</button>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default Countries;
