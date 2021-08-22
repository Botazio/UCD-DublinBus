import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../../providers/AuthContext";
import CustomError from "../../../reusable-components/error/CustomError";
import FavoritesCSS from "../Favorites.module.css";
import SecondarySearchBarStops from "../../../reusable-components/searchbar-stops/SecondarySearchBarStops";
import PrimaryPagination from "../../../reusable-components/custom-pagination/PrimaryPagination";
import DisplayStops from "../../display-stops/DisplayStops";
import Card from "../../../reusable-components/card/Card";
import { useStops } from "../../../providers/StopsContext";
import Waiting from "../../../reusable-components/waiting/Waiting";

// This component renders the user favorite stops 
const FavoriteStops = () => {
   // Stops to be displayed on the page. They are filtered by the search bar 
   const [visibleStops, setVisibleStops] = useState();
   // User stops
   const [filteredStops, setFilteredStops] = useState();
   // State for the pagination in the results
   const [page, setPage] = useState(1);

   // Get the data from the provider
   const { data: stops, isPending, error } = useStops();

   // Get the user stops from the user provider
   const { currentUser } = useAuth();
   const favoriteStops = currentUser.favoritestops;

   // Set the visible stops to all of them the first time the component renders
   useEffect(() => {
      if (stops && favoriteStops) {
         // Get the full stop object 
         const arrayStops = stops.filter(({ stop_id: id1 }) => favoriteStops.some(({ stop: id2 }) => id2 === id1));
         setFilteredStops(arrayStops);
         setVisibleStops(arrayStops);
      }
   }, [stops, favoriteStops]);

   // function that sets the results page with the new value
   const handlePage = (event, value) => {
      setPage(value);
   };

   // Error handling when fetching for the data
   if (error) return <CustomError height="60" message="Unable to fetch the data" />;

   // Wait for the data
   if (isPending) return <Waiting size={80} thickness={3} />;


   return (
      <>
         <div className={FavoritesCSS.info_wrapper}>
            {/* Loop through the visible stops and display them */}
            {visibleStops && <Card variant="last">
               <SecondarySearchBarStops stops={filteredStops} setVisibleStops={setVisibleStops} classes={FavoritesCSS.searchbar} />
               <DisplayStops stops={visibleStops} page={page} variant="favorites" />

               {/* Pagination for the results */}
               {visibleStops && <div className={FavoritesCSS.pagination}>
                  <PrimaryPagination onChange={handlePage} page={page} count={Math.ceil(visibleStops.length / 10)} color="primary" size="small" />
               </div>}

            </Card>}

         </div>
      </>
   );
};

export default FavoriteStops;