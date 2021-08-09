import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../../providers/AuthContext";
import CustomError from "../../../reusable-components/error/CustomError";
import FavoritesCSS from "../Favorites.module.css";
import SecondarySearchBarStops from "../../../reusable-components/searchbar-stops/SecondarySearchBarStops";
import PrimaryPagination from "../../../reusable-components/custom-pagination/PrimaryPagination";
import DisplayStops from "../../display-stops/DisplayStops";
import Card from "../../../reusable-components/card/Card";

// This component renders the managing system to delete the already saved favorite stops 
const FavoriteStops = () => {
   // Markers to be displayed on the page. They are filtered by the search bar 
   const [visibleStops, setVisibleStops] = useState();
   // State for the pagination in the results
   const [page, setPage] = useState(1);

   // Get the user stops from the user provider
   const { currentUser } = useAuth();
   const favoriteStops = currentUser.favoritestops;

   // Set the visible stops to all of them the first time the component renders
   useEffect(() => {
      if (favoriteStops) {
         setVisibleStops(favoriteStops);
      }
   }, [favoriteStops]);

   // function that sets the results page with the new value
   const handlePage = (event, value) => {
      setPage(value);
   };

   // Error handling when fetching for the data
   if (!favoriteStops) return <CustomError height="60" message="Unable to fetch the data" />;


   return (
      <>
         <div className={FavoritesCSS.info_wrapper}>
            {/* Loop through the visible stops and display them */}
            {visibleStops && <Card>
               <SecondarySearchBarStops stops={favoriteStops} setVisibleStops={setVisibleStops} classes={FavoritesCSS.searchbar} />
               <DisplayStops stops={visibleStops} page={page} variant="favorites" />
            </Card>}

            {/* Display a message if the user has not any favorite stops yet */}
            {(favoriteStops.length === 0) && <div className={FavoritesCSS.no_stops_message}><h4>No saved stops</h4></div>}

            {/* Pagination for the results */}
            {visibleStops && <div className={FavoritesCSS.pagination}>
               <PrimaryPagination onChange={handlePage} page={page} count={Math.ceil(visibleStops.length / 10)} color="primary" size="small" />
            </div>}

         </div>
      </>
   );
};

export default FavoriteStops;