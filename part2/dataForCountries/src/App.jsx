import { useState, useEffect } from "react";

import Countries from "./components/Countries";
import country from "./services/country";
const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const api_key = import.meta.env.VITE_SOME_KEY;

  useEffect(() => {
    country.getAll().then((initialCountries) => {
      setCountries(initialCountries);
    });
  }, []);

  return (
    <div>
      find countries <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <Countries countries={countries} filter={filter} setFilter={setFilter} api_key={api_key} />
    </div>
  );
};

export default App;
