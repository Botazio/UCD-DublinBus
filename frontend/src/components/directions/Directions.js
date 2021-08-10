import { useState } from "react";
import DirectionsCSS from "./Directions.module.css";
import PrimarySearchBarLines from "../../reusable-components/searchbar-lines/PrimarySearchBarLines";
import DirectionsSearcher from "./subcomponents/DirectionsSearcher";
import { useLines } from "../../providers/LinesContext";
import Waiting from "../../reusable-components/waiting/Waiting";
import CustomError from "../../reusable-components/error/CustomError";

// This component is the main component for the directions section.
// The subcomponents are called from this component
const Directions = () => {
  // This state controls if a line has been selected before displaying
  // the directions system
  const [selectedLine, setSelectedLine] = useState();

  // Get the data from the provider
  const { data: lines, isPending, error } = useLines();

  // Error handling when fetching for the data
  if (error) return <CustomError height="60" message="Unable to fetch the data" />;

  // Wait for the data
  if (isPending) return <Waiting variant="dark" />;

  if (!lines) return "";

  return (
    <>
      {/* Search bar for the lines */}
      {!selectedLine && <div className={DirectionsCSS.searchbar_lines}>
        <PrimarySearchBarLines placeholder="Search line..." lines={lines} setSelectedLine={setSelectedLine} />
      </div>}
      {selectedLine && <DirectionsSearcher selectedLine={selectedLine} setSelectedLine={setSelectedLine} />}
    </>
  );
};

export default Directions;
