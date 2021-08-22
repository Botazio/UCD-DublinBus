import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../../../providers/AuthContext";
import { useLines } from "../../../../providers/LinesContext";
import CustomError from "../../../../reusable-components/error/CustomError";
import Waiting from "../../../../reusable-components/waiting/Waiting";
import FavoritesCSS from "../../Favorites.module.css";
import PrimaryPagination from "../../../../reusable-components/custom-pagination/PrimaryPagination";
import { Button, useTheme } from "@material-ui/core";
import ActionWrapper from "../../../../reusable-components/action/ActionWrapper";
import SecondarySearchBarLines from "../../../../reusable-components/searchbar-lines/SecondarySearchBarLines";
import LineContainer from "./LineContainer";
import ActionAddLines from "../../../../reusable-components/action/ActionAddLines";

// This component renders the managing system to add new favorite lines
const AllLines = () => {
   // Markers to be displayed on the page. They are filtered by the search bar 
   const [visibleLines, setVisibleLines] = useState();
   // State to control when to display and hide the action message
   const [action, setAction] = useState(false);
   // State for the pagination in the results
   const [page, setPage] = useState(1);
   // State that controls when to display the button to submit the changes
   const [activeLines, setActiveLines] = useState([]);

   // Get the data from the provider
   const { data: lines, isPending, error } = useLines();

   // Grab the theme from the provider
   const theme = useTheme().theme;

   // Get the user lines from the user provider
   const { currentUser } = useAuth();
   const favoriteLines = currentUser.favoritelines;

   // Set the visible lines to all of them the first time the component renders
   useEffect(() => {
      if (lines && favoriteLines) {
         // Do not show the lines that are already part of the 
         // user favorite lines
         const filteredLines = lines.filter(
            ({ route__route_short_name: name1, direction_id: dir1 }) => !favoriteLines.some(({ route_short_name: name2, direction_id: dir2 }) => (name1 === name2 && dir1 === dir2)));
         setVisibleLines(filteredLines);
      }
   }, [lines, favoriteLines]);

   // function that sets the results page with the new value
   const handlePage = (event, value) => {
      setPage(value);
   };

   // Error handling when fetching for the data
   if (!favoriteLines) return <div style={{ padding: "15px" }}><CustomError height="50" message="Unable to fetch the data" messageSize="1.1rem" /></div>;

   // Error handling when fetching for the data
   if (error) return <div style={{ padding: "15px" }}><CustomError height="50" message="Unable to fetch the data" messageSize="1.1rem" /></div>;

   // Wait for the data
   if (isPending) return <div style={{ padding: '15px' }}><Waiting size={50} thickness={3} /></div>;


   return (
      <>
         <div className={FavoritesCSS.info_wrapper}>
            {/* Search bar */}
            {lines && <SecondarySearchBarLines lines={lines} setVisibleLines={setVisibleLines} />}

            {/* Loop through the visible lines and display them */}
            {visibleLines && visibleLines.slice((page - 1) * 5, ((page - 1) * 5) + 5).map((line) => (
               <LineContainer key={line.trip_id} line={line} activeLines={activeLines} setActiveLines={setActiveLines} type="add" />
            ))}

            {/* Pagination for the results */}
            {visibleLines && <div className={FavoritesCSS.pagination} style={{ borderTop: `1px solid ${theme.divider}` }}>
               <PrimaryPagination onChange={handlePage} page={page} count={Math.ceil(visibleLines.length / 5)} color="primary" size="small" />
            </div>}

            {/* Action button to save the changes. It is displayed if the active lines has at least one value */}
            {(activeLines.length !== 0) && <div className={FavoritesCSS.action_button}>
               <Button
                  fullWidth={true} variant="outlined" color="primary" onClick={() => setAction(true)}>change favorites
               </Button>
            </div>}
         </div>

         {/* Display an action if it is active */}
         {action && <ActionWrapper title={"Add favorite lines"} setAction={setAction}>
            <ActionAddLines activeLines={activeLines} setActiveLines={setActiveLines} />
         </ActionWrapper>}
      </>
   );

};

export default AllLines;