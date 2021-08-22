import React, { useMemo } from "react";
import { useThrottle } from "react-use";
import { matchSorter } from "match-sorter";
import {
   Combobox,
   ComboboxList,
   ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import CustomComboboxInput from "../custom-combobox-input/CustomComboboxInput";
import CustomComboboxPopover from "../custom-combobox-popover/CustomComboboxPopover";

// This reusable component provides the user with a combobox while
// he enters text. The combobox contains suggestions for the user 
// that matches the input the user is entering
const PrimarySearchBarLines = ({ placeholder, lines, setSelectedLine }) => {
   // States
   const [term, setTerm] = React.useState("");
   const results = usePlaceMatch(term);

   // Function that controls wheter the user enters new input
   const handleChange = (e) => setTerm(e.target.value);

   return (
      <Combobox
         onSelect={(name) => {
            setTerm(name);
            // Split the term
            const trip_headsign = name.split(", ")[1];

            // Search for the line name and pass the full line object to the function
            const selectedLine = lines.find((line) => line.trip_headsign === trip_headsign);
            handleSubmit(selectedLine);
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
                           key={"suggestion" + result.trip_headsign}
                           value={"Line " + result.route__route_short_name + ", " + result.trip_headsign}
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
   function handleSubmit(line) {
      setSelectedLine(line);
   }

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

export default PrimarySearchBarLines;