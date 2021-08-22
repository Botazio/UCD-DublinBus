import React, { useMemo } from "react";
import { useThrottle } from "react-use";
import { matchSorter } from "match-sorter";
import {
  Combobox
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useEffect } from "react";
import CustomComboboxInput from "../custom-combobox-input/CustomComboboxInput";

// This component gives stop suggestions to the user while input is being entered
// The suggestions are not given inside a combobox. It just sets the visible lines to these suggestions.
// The higher order component is the one in charge of handling this info
const SecondarySearchBarLines = ({ lines, setVisibleLines }) => {
  // States
  const [term, setTerm] = React.useState("");
  const results = usePlaceMatch(term);

  // This useEffect is called every time the results change
  useEffect(() => {
    // If there are results even if the array is empty
    if (results) {
      setVisibleLines(results);
    }
    // If there are no results 
    if (!results) {
      setVisibleLines(lines);
    }
    // eslint-disable-next-line
  }, [results]);

  // Function that controls wheter the user enters new input
  const handleChange = (e) => setTerm(e.target.value);

  return (
    <Combobox style={{ width: "100%" }}>
      <CustomComboboxInput
        autoComplete="off"
        value={term}
        onChange={handleChange}
        placeholder="Search lines..."
      />
    </Combobox>
  );

  // Filter that return recommended options
  function usePlaceMatch() {
    // Waits 0.1s before giving another prediction
    const throttledTerm = useThrottle(term, 100);
    /* eslint-disable */
    return useMemo(() => term === "" ? null :
      matchSorter(lines, term, { keys: ["route__route_short_name"] },
        { threshold: matchSorter.rankings.STARTS_WITH }), [throttledTerm]);
  }
};

export default SecondarySearchBarLines;
