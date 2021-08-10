import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../../../providers/AuthContext";
import CustomError from "../../../../reusable-components/error/CustomError";
import FavoritesCSS from "../../Favorites.module.css";
import StopContainer from "./StopContainer";
import SecondarySearchBarStops from "../../../../reusable-components/searchbar-stops/SecondarySearchBarStops";
import Action from "../../../../reusable-components/action/Action";
import PrimaryButton from "../../../../reusable-components/custom-buttons/PrimaryButton";
import PrimaryPagination from "../../../../reusable-components/custom-pagination/PrimaryPagination";
import { useStops } from "../../../../providers/StopsContext";
import Waiting from "../../../../reusable-components/waiting/Waiting";
import { actionDelete } from "../../../../helpers/utils";

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
   if (!favoriteStops) return <CustomError height="60" message="Unable to fetch the data" />;

   // Error handling when fetching for the data
   if (error) return <CustomError height="60" message="Unable to fetch the data" />;

   // Wait for the data
   if (isPending) return <div style={{ padding: '15px' }}><Waiting variant="dark" size="small" /></div>;


   return (
      <>
         <div className={FavoritesCSS.info_wrapper}>
            {/* Search bar */}
            {(favoriteStops.length !== 0) && <SecondarySearchBarStops stops={filteredStops} setVisibleStops={setVisibleStops} classes={FavoritesCSS.searchbar} />}

            {/* Loop through the visible stops and display them */}
            {visibleStops && visibleStops.slice((page - 1) * 5, ((page - 1) * 5) + 5).map((stop) => (
               <StopContainer key={stop.stop_id} stop={stop} activeStops={activeStops} setActiveStops={setActiveStops} type="delete" />
            ))}

            {/* Display a message if the user has not any favorite stops yet */}
            {(favoriteStops.length === 0) && <div className={FavoritesCSS.no_stops_message}><h4>No saved stops</h4></div>}

            {/* Pagination for the results */}
            {visibleStops && <div className={FavoritesCSS.pagination}>
               <PrimaryPagination onChange={handlePage} page={page} count={Math.ceil(visibleStops.length / 5)} color="primary" size="small" />
            </div>}

            {/* Action button to save the changes */}
            {(activeStops.length !== 0) && <div className={FavoritesCSS.action_button}>
               <PrimaryButton
                  fullWidth={true} onClick={() => setAction(true)}>save changes
               </PrimaryButton>
            </div>}
         </div>

         {/* Display an action if it is active */}
         {action && <Action message="Change favorite stops" type="fav_stops" color="primary" buttonMessage="Change favorites" setAction={setAction} handleSubmit={handleSubmit} />}
      </>
   );

   // This function is passed to the action to add selected stops to favorites
   async function handleSubmit(isAuthenticated, setError, setIsPending, setOkMessage) {
      // Wait for the fetch calls to finish 
      const arrayResponses = await Promise.all(
         activeStops.map((stop) => {
            let response = actionDelete(
               `https://csi420-02-vm6.ucd.ie/favoritestop/${stop.user_stop_id}/`,
               isAuthenticated,
               setError,
               setIsPending,
               setOkMessage
            );

            return response;
         }
         ));

      // Set the active stops to an empty array even if the response is not ok
      setActiveStops([]);

      // Close the action component after one second
      if (arrayResponses.length === activeStops.length) {
         setTimeout(() => {
            setAction(false);
         }, 1000);
      }

   };

};

export default MyStops;