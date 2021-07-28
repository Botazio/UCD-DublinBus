import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../../../providers/AuthContext";
import { useStops } from "../../../../providers/StopsContext";
import CustomError from "../../../../reusable-components/error/CustomError";
import Waiting from "../../../../reusable-components/waiting/Waiting";
import FavoritesCSS from "../../Favorites.module.css";
import StopContainer from "./StopContainer";
import StopsSearchBar from "./StopsSearchBar";
import Action from "../../../../reusable-components/action/Action";
import PrimaryButton from "../../../../reusable-components/custom-buttons/PrimaryButton";
import PrimaryPagination from "../../../../reusable-components/custom-pagination/PrimaryPagination";

// This component renders the managing system to add new favorite stops 
const AllStops = () => {
   // Markers to be displayed on the page. They are filtered by the search bar 
   const [visibleStops, setVisibleStops] = useState();
   // State to control when to display and hide the action message
   const [action, setAction] = useState(false);
   // State for the pagination in the results
   const [page, setPage] = useState(1);
   // State that controls when to display the button to submit the changes
   const [activeStops, setActiveStops] = useState([]);

   // Get the data from the provider
   const { data: stops, isPending, error } = useStops();

   // Get the user stops from the user provider
   const { currentUser } = useAuth();
   const favoriteStops = currentUser.favouritestops;

   // Set the visible stops to all of them the first time the component renders
   useEffect(() => {
      if (stops) {
         // Do not show the stops that are already part of the 
         // user favorite stops
         const filteredStops = stops.filter(x => favoriteStops.indexOf(x) === -1);
         setVisibleStops(filteredStops);
      }
   }, [stops, favoriteStops]);

   // function that sets the results page with the new value
   const handlePage = (event, value) => {
      setPage(value);
   };

   // Error handling when fetching for the data
   if (error) return <CustomError height="60" message="Unable to fetch the data" />;

   // Wait for the data
   if (isPending) return <Waiting variant="dark" size="small" />;


   return (
      <>
         <div className={FavoritesCSS.info_wrapper}>
            {/* Search bar */}
            {stops && <StopsSearchBar stops={stops} setVisibleStops={setVisibleStops} />}

            {/* Loop through the visible stops and display them */}
            {visibleStops && visibleStops.slice((page - 1) * 5, ((page - 1) * 5) + 5).map((stop) => (
               <StopContainer key={stop.stop_id} stop={stop} activeStops={activeStops} setActiveStops={setActiveStops} type="add" />
            ))}

            {/* Pagination for the results */}
            {visibleStops && <div className={FavoritesCSS.pagination}>
               <PrimaryPagination onChange={handlePage} page={page} count={Math.ceil(visibleStops.length / 5)} color="primary" size="small" />
            </div>}

            {/* Action button to save the changes. It is displayed if the active stops has at least one value */}
            {(activeStops.length !== 0) && <div className={FavoritesCSS.action_button}>
               <PrimaryButton
                  fullWidth={true} onClick={() => setAction(true)}>save changes
               </PrimaryButton>
            </div>}
         </div>

         {/* Display an action if it is active */}
         {action && <Action message="Change favorite stops" type="fav_stops" color="primary" buttonMessage="Change favorites" setAction={setAction} />}
      </>
   );
};

export default AllStops;