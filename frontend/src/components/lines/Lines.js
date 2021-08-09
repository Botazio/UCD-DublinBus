import LinesCSS from "./Lines.module.css";
import Waiting from "../../reusable-components/waiting/Waiting";
import CustomError from "../../reusable-components/error/CustomError";
import { useState } from "react";
import { useLines } from "../../providers/LinesContext";
import PrimarySearchBarLines from "../../reusable-components/searchbar-lines/PrimarySearchBarLines";
import LineBox from "./subcomponents/LineBox";

// This component is the main component for the lines system.
const Lines = () => {
   // State to select a line. It is handled by the PrimarySearchBarLine component
   const [selectedLine, setSelectedLine] = useState(null);

   // Get the data from the provider
   const { data: lines, isPending, error } = useLines();

   // Error handling when fetching for the data
   if (error) return <CustomError height="60" message="Unable to fetch the data" />;

   // Wait for the data
   if (isPending) return <Waiting variant="dark" />;

   console.log(selectedLine);

   return (
      <>
         <div className={LinesCSS.header}>
            {/* Display the searchbar */}
            <div className={LinesCSS.searchbar}>
               <PrimarySearchBarLines
                  placeholder={"Search lines..."}
                  lines={lines}
                  setSelectedLine={setSelectedLine}
               />
            </div>
         </div>

         {/* If there is a line selected display the next buses*/}
         {selectedLine && <LineBox selectedLine={selectedLine} />}
      </>
   );
};

export default Lines;