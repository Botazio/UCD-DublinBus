import React, { useMemo } from "react";
import { useThrottle } from "react-use";
import { matchSorter } from "match-sorter";
import {
  Combobox,
  ComboboxInput
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useEffect } from "react";
import FavoritesCSS from "../../Favorites.module.css";

// This component gives stop suggestions to the user while input is being entered
const StopsSearchBar = ({ stops, setVisibleStops }) => {
  // States
  const [term, setTerm] = React.useState("");
  const results = usePlaceMatch(term);

  // This useEffect is called every time the results change
  useEffect(() => {
    // If there are results even if the array is empty
    if (results) {
      setVisibleStops(results);
    }
    // If there are no results 
    if (!results) {
      setVisibleStops(stops);
    }
    // eslint-disable-next-line
  }, [results]);

  // Function that controls wheter the user enters new input
  const handleChange = (e) => setTerm(e.target.value);

  return (
    <Combobox>
      <ComboboxInput
        className={FavoritesCSS.searchbar}
        autoComplete="off"
        value={term}
        onChange={handleChange}
        placeholder="Search stops..."
      />
    </Combobox>
  );

  // Filter that return recommended options
  function usePlaceMatch() {
    // Waits 0.1s before giving another prediction
    const throttledTerm = useThrottle(term, 100);
    /* eslint-disable */
    return useMemo(() => term === "" ? null :
      matchSorter(stops, term, { keys: ["stop_name", "stop_number"] },
        { threshold: matchSorter.rankings.STARTS_WITH }), [throttledTerm]);
  }
};

export default StopsSearchBar;
