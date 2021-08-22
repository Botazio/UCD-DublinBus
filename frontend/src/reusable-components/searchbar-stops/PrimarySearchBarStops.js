import React, { useMemo } from "react";
import { useThrottle } from "react-use";
import { matchSorter } from "match-sorter";
import {
  Combobox,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useEffect } from "react";
import CustomComboboxInput from "../custom-combobox-input/CustomComboboxInput";
import CustomComboboxPopover from "../custom-combobox-popover/CustomComboboxPopover";

// This reusable component provides the user with a combobox while
// he enters text. The combobox contains suggestions for the user 
// that matches the input the user is entering
const PrimarySearchBarStops = ({ placeholder, stops, selectedStop, setSelectedStop }) => {
  // States
  const [term, setTerm] = React.useState("");
  const results = usePlaceMatch(term);

  useEffect(() => {
    if (!selectedStop) setTerm("");
  }, [selectedStop]);

  // Function that controls wheter the user enters new input
  const handleChange = (e) => setTerm(e.target.value);


  return (
    <Combobox
      onSelect={(stop_name) => {
        setTerm(stop_name);
        // Search for the station name and pass the full stop object to the function
        const selectedStop = stops.find((stop) => stop.stop_name === stop_name);
        handleSubmit(selectedStop);
      }}
    >
      <CustomComboboxInput
        placeholder={placeholder}
        autoComplete="off"
        value={term}
        onChange={handleChange}
      />
      {results && (
        <CustomComboboxPopover>
          {results.length > 0 ? (
            <ComboboxList>
              {results.slice(0, 5).map((result) => (
                <ComboboxOption
                  key={"suggestion" + result.stop_id}
                  value={result.stop_name}
                />
              ))}
            </ComboboxList>
          ) : (
            <p style={{ display: "block", margin: 8, fontSize: "1rem" }}>
              No results found
            </p>
          )}
        </CustomComboboxPopover>
      )}
    </Combobox>
  );

  // When the user selects an option sets the state of the search to active
  function handleSubmit(stop) {
    setSelectedStop(stop);
  }

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

export default PrimarySearchBarStops;
