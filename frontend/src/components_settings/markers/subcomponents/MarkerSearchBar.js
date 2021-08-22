import React, { useMemo } from "react";
import { useThrottle } from "react-use";
import { matchSorter } from "match-sorter";
import {
  Combobox,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useEffect } from "react";
import CustomComboboxInput from "../../../reusable-components/custom-combobox-input/CustomComboboxInput";

// This component gives stop suggestions to the user while input is being entered
const MarkerSearchBar = ({ markers, setVisibleMarkers }) => {
  // States
  const [term, setTerm] = React.useState("");
  const results = usePlaceMatch(term);

  // This useEffect is called every time the results change
  useEffect(() => {
    // If there are results even if the array is empty
    if (results) {
      // map the results to set the entries to the proper form
      var visibleMarkers = {};
      results.forEach((result) => {
        visibleMarkers[result] = markers[result];
      });
      setVisibleMarkers(visibleMarkers);
    }
    // If there are no results 
    if (!results) {
      setVisibleMarkers(markers);
    }
    // eslint-disable-next-line
  }, [results]);

  // Function that controls wheter the user enters new input
  const handleChange = (e) => setTerm(e.target.value);

  return (
    <Combobox>
      <CustomComboboxInput
        margin="0px"
        autoComplete="off"
        value={term}
        onChange={handleChange}
        placeholder="Search..."
      />
    </Combobox>
  );

  // Filter that return recommended options
  function usePlaceMatch() {
    // Waits 0.1s before giving another prediction
    const throttledTerm = useThrottle(term, 100);
    /* eslint-disable */
    return useMemo(() => term === "" ? null :
      matchSorter(Object.keys(markers), term,
        { threshold: matchSorter.rankings.STARTS_WITH }), [throttledTerm]);
  }
};

export default MarkerSearchBar;
