import { useState } from "react";
import PlannerCSS from "./Planner.module.css";
import PrimarySearchBarLines from "../../reusable-components/searchbar-lines/PrimarySearchBarLines";
import PlannerSearcher from "./subcomponents/PlannerSearcher";
import { useLines } from "../../providers/LinesContext";
import Waiting from "../../reusable-components/waiting/Waiting";
import CustomError from "../../reusable-components/error/CustomError";

// This component is the main component for the planner section.
// The subcomponents are called from this component
const Planner = () => {
  // This state controls if a line has been selected before displaying
  // the planner system
  const [selectedLine, setSelectedLine] = useState();

  // Get the data from the provider
  const { data: lines, isPending, error } = useLines();

  // Error handling when fetching for the data
  if (error) return <CustomError height="60" message="Unable to fetch the data" />;

  // Wait for the data
  if (isPending) return <Waiting size={80} thickness={3} />;

  if (!lines) return "";

  return (
    <>
      {/* Search bar for the lines */}
      {!selectedLine && <div className={PlannerCSS.searchbar_lines}>
        <PrimarySearchBarLines placeholder="Search line..." lines={lines} setSelectedLine={setSelectedLine} />
      </div>}
      {/* Display the planner system */}
      {selectedLine && <PlannerSearcher selectedLine={selectedLine} setSelectedLine={setSelectedLine} />}
    </>
  );
};

export default Planner;
