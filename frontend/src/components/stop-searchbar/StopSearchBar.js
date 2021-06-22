import StopSearchBarCSS from './StopSearchBar.module.css';
import React, { useEffect, useMemo } from 'react';
import { useThrottle } from 'react-use';
import { matchSorter } from 'match-sorter';
import {
   Combobox,
   ComboboxInput,
   ComboboxPopover,
   ComboboxList,
   ComboboxOption
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const StopSearchBar = ({ placeholder }) => {
   const [term, setTerm] = React.useState("");
   const results = usePlaceMatch(term);
   const handleChange = (e) => setTerm(e.target.value);

   useEffect(() => {
      setTerm("")
   }, []);

   return (
      <Combobox
         className={StopSearchBarCSS.combobox}
         onSelect={(address) => {
            setTerm(address);
         }}>

         <ComboboxInput
            className={StopSearchBarCSS.search_input}
            placeholder={placeholder}
            autoComplete="off"
            value={term}
            onChange={handleChange}
         />
         <ComboboxPopover style={{ zIndex: 100000 }}>
            <ComboboxList>
            </ComboboxList>
         </ComboboxPopover>
      </Combobox>
   );

   function handleSubmit(result) {
   }

   function usePlaceMatch() {
      const throttledTerm = useThrottle(term, 100);
      /* eslint-disable */
      return useMemo(() =>
         term === "" ? null :
            matchSorter(stations, term, { keys: ['address'] }, { threshold: matchSorter.rankings.STARTS_WITH }),
         [throttledTerm]);
   }
}

export default StopSearchBar;