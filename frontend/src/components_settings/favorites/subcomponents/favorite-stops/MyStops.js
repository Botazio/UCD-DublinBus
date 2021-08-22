import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../../../providers/AuthContext";
import CustomError from "../../../../reusable-components/error/CustomError";
import FavoritesCSS from "../../Favorites.module.css";
import StopContainer from "./StopContainer";
import SecondarySearchBarStops from "../../../../reusable-components/searchbar-stops/SecondarySearchBarStops";
import PrimaryPagination from "../../../../reusable-components/custom-pagination/PrimaryPagination";
import { useStops } from "../../../../providers/StopsContext";
import Waiting from "../../../../reusable-components/waiting/Waiting";
import { Button, useTheme } from "@material-ui/core";
import ActionWrapper from "../../../../reusable-components/action/ActionWrapper";
import ActionDeleteStops from "../../../../reusable-components/action/ActionDeleteStops";

// This component renders the managing system to delete the already saved favorite stops 
// Should be rewritten to be reusable for AllStops and MyStops
const MyStops = () => {
   // Stops to be displayed on the page. They are filtered by the search bar 
   const [visibleStops, setVisibleStops] = useState();
   // User stops
   const [filteredStops, setFilteredStops] = useState();
   // State to control when to display and hide the action message
   const [action, setAction] = useState(false);
   // State for the pagination in the results
   const [page, setPage] = useState(1);
   // State that controls when to display the button to submit the changes
   const [activeStops, setActiveStops] = useState([]);

   // Get the user stops from the user provider
   const { currentUser } = useAuth();
   const favoriteStops = currentUser.favoritestops;

   // Grab the theme from the provider
   const theme = useTheme().theme;

   // Get the data from the provider
   const { data: stops, isPending, error } = useStops();

   // Set the visible stops to all of them the first time the component renders
   useEffect(() => {
      if (favoriteStops && stops) {
         // Filter the user favorite stops
         const arrayStops = stops.filter((stop1) => favoriteStops.some((stop2) => {
            if (stop1.stop_id === stop2.stop) {
               stop1.user_stop_id = stop2.id;
               return true;
            }
            return false;
         }));
         setFilteredStops(arrayStops);
         setVisibleStops(arrayStops);
      }
   }, [stops, favoriteStops]);

   // function that sets the results page with the new value
   const handlePage = (event, value) => {
      setPage(value);
   };

   // Error handling when fetching for the data
   if (!favoriteStops) return <div style={{ padding: "15px" }}><CustomError height="50" message="Unable to fetch the data" messageSize="1.1rem" /></div>;

   // Error handling when fetching for the data
   if (error) return <div style={{ padding: "15px" }}><CustomError height="50" message="Unable to fetch the data" messageSize="1.1rem" /></div>;

   // Wait for the data
   if (isPending) return <div style={{ padding: '15px' }}><Waiting size={50} thickness={3} /></div>;


   return (
      <>
         <div className={FavoritesCSS.info_wrapper}>
            {/* Search bar */}
            {(favoriteStops.length !== 0) && <SecondarySearchBarStops stops={filteredStops} setVisibleStops={setVisibleStops} />}

            {/* Loop through the visible stops and display them */}
            {visibleStops && visibleStops.slice((page - 1) * 5, ((page - 1) * 5) + 5).map((stop) => (
               <StopContainer key={stop.stop_id} stop={stop} activeStops={activeStops} setActiveStops={setActiveStops} type="delete" />
            ))}

            {/* Display a message if the user has not any favorite stops yet */}
            {(favoriteStops.length === 0) && <div className={FavoritesCSS.no_items_message}><h4>No saved stops</h4></div>}

            {/* Pagination for the results */}
            {visibleStops && <div className={FavoritesCSS.pagination} style={{ borderTop: `1px solid ${theme.divider}` }}>
               <PrimaryPagination onChange={handlePage} page={page} count={Math.ceil(visibleStops.length / 5)} color="primary" size="small" />
            </div>}

            {/* Action button to save the changes */}
            {(activeStops.length !== 0) && <div className={FavoritesCSS.action_button}>
               <Button
                  fullWidth={true} variant="outlined" color="primary" onClick={() => setAction(true)}>change favorites
               </Button>
            </div>}
         </div>


         {/* Display an action if it is active */}
         {action && <ActionWrapper title={"Delete favorite stops"} setAction={setAction}>
            <ActionDeleteStops activeStops={activeStops} setActiveStops={setActiveStops} />
         </ActionWrapper>}
      </>
   );

};

export default MyStops;