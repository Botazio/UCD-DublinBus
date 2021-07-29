import { useState } from "react";
import DirectionsCSS from "./Directions.module.css";
import LineSearchBar from "../line-searchbar/LineSearchBar";
import DirectionsSearcher from "./subcomponents/DirectionsSearcher";

// This component is the main component for the directions section.
// The subcomponents are called from this component
const Directions = () => {
  // This state controls if a line has been selected before displaying
  // the search bars
  const [activeLine, setActiveLine] = useState(4);
  return (
    <>
      {/* Search bar for the lines */}
      {!activeLine && <div className={DirectionsCSS.searchbar_lines}>
        <LineSearchBar placeholder="Search Line..." />
      </div>}
      {activeLine && <DirectionsSearcher activeLine={activeLine} setActiveLine={setActiveLine} />}
    </>
  );
};

export default Directions;
