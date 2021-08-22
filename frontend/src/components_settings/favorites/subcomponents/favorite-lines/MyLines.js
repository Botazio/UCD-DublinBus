import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../../../providers/AuthContext";
import CustomError from "../../../../reusable-components/error/CustomError";
import FavoritesCSS from "../../Favorites.module.css";
import PrimaryPagination from "../../../../reusable-components/custom-pagination/PrimaryPagination";
import Waiting from "../../../../reusable-components/waiting/Waiting";
import { Button, useTheme } from "@material-ui/core";
import ActionWrapper from "../../../../reusable-components/action/ActionWrapper";
import { useLines } from "../../../../providers/LinesContext";
import SecondarySearchBarLines from "../../../../reusable-components/searchbar-lines/SecondarySearchBarLines";
import LineContainer from "./LineContainer";
import ActionDeleteLines from "../../../../reusable-components/action/ActionDeleteLines";

// This component renders the managing system to delete the already saved favorite lines 
const MyLines = () => {
   // Lines to be displayed on the page. They are filtered by the search bar 
   const [visibleLines, setVisibleLines] = useState();
   // User lines
   const [filteredLines, setFilteredLines] = useState();
   // State to control when to display and hide the action message
   const [action, setAction] = useState(false);
   // State for the pagination in the results
   const [page, setPage] = useState(1);
   // State that controls when to display the button to submit the changes
   const [activeLines, setActiveLines] = useState([]);

   // Get the user lines from the user provider
   const { currentUser } = useAuth();
   const favoriteLines = currentUser.favoritelines;

   // Grab the theme from the provider
   const theme = useTheme().theme;

   // Get the data from the provider
   const { data: lines, isPending, error } = useLines();

   // Set the visible lines to all of them the first time the component renders
   useEffect(() => {
      if (favoriteLines && lines) {
         // Filter the user favorite lines
         const arrayLines = lines.filter((line1) => favoriteLines.some((line2) => {
            if (line1.route__route_short_name === line2.route_short_name && line1.direction_id === line2.direction_id) {
               line1.user_line_id = line2.id;
               return true;
            }
            return false;
         }));
         setFilteredLines(arrayLines);
         setVisibleLines(arrayLines);
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
            {(favoriteLines.length !== 0) && <SecondarySearchBarLines lines={filteredLines} setVisibleLines={setVisibleLines} />}

            {/* Loop through the visible lines and display them */}
            {visibleLines && visibleLines.slice((page - 1) * 5, ((page - 1) * 5) + 5).map((line) => (
               <LineContainer key={line.trip_id} line={line} activeLines={activeLines} setActiveLines={setActiveLines} type="delete" />
            ))}

            {/* Display a message if the user has not any favorite lines yet */}
            {(favoriteLines.length === 0) && <div className={FavoritesCSS.no_items_message}><h4>No saved lines</h4></div>}

            {/* Pagination for the results */}
            {visibleLines && <div className={FavoritesCSS.pagination} style={{ borderTop: `1px solid ${theme.divider}` }}>
               <PrimaryPagination onChange={handlePage} page={page} count={Math.ceil(visibleLines.length / 5)} color="primary" size="small" />
            </div>}

            {/* Action button to save the changes */}
            {(activeLines.length !== 0) && <div className={FavoritesCSS.action_button}>
               <Button
                  fullWidth={true} variant="outlined" color="primary" onClick={() => setAction(true)}>change favorites
               </Button>
            </div>}
         </div>


         {/* Display an action if it is active */}
         {action && <ActionWrapper title={"Delete favorite lines"} setAction={setAction}>
            <ActionDeleteLines activeLines={activeLines} setActiveLines={setActiveLines} />
         </ActionWrapper>}
      </>
   );

};

export default MyLines;