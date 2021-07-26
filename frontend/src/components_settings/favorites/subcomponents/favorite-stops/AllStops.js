import Pagination from "@material-ui/lab/Pagination";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../../../providers/AuthContext";
import { useStops } from "../../../../providers/StopsContext";
import CustomError from "../../../../reusable-components/error/CustomError";
import Waiting from "../../../../reusable-components/waiting/Waiting";
import FavoritesCSS from "../../Favorites.module.css";
import StopsSearchBar from "./StopsSearchBar";

const AllStops = () => {
   // Markers to be displayed on the page. They are filtered by the search bar 
   const [visibleStops, setVisibleStops] = useState();
   // State to control when to display and hide the action message
   const [action, setAction] = useState(false);
   // State for the pagination in the results
   const [page, setPage] = useState(1);

   // Get the data from the provider
   const { data: stops, isPending, error } = useStops();

   // Get the user stops from the user provider
   const { currentUser } = useAuth();
   const favoriteStops = currentUser.favouritestops;

   // Set the visible stops to all of them the first time the component renders
   useEffect(() => {
      if (stops) {
         setVisibleStops(stops);
      }
   }, [stops]);

   // function that sets the results page with the new value
   const handlePage = (event, value) => {
      setPage(value);
   };

   // Error handling when fetching for the data
   if (error) return <CustomError height="60" message="Unable to fetch the data" />;

   // Wait for the data
   if (isPending) return <Waiting variant="dark" />;


   return (
      <div className={FavoritesCSS.info_box}>
         {/* Search bar */}
         {stops && <StopsSearchBar stops={stops} setVisibleStops={setVisibleStops} />}

         {/* Loop through the visible stops and display them */}
         {visibleStops && visibleStops.slice((page - 1) * 10, ((page - 1) * 10) + 10).map((stop) => (
            <div className={FavoritesCSS.stop_header}>
               <div className={FavoritesCSS.stop_title}>
                  <h4>{stop.stop_name}</h4>
               </div>
               <div className={FavoritesCSS.stop_lines_div}>
                  {stop.stop_lines.map((line, index) => (<div key={line + index}>{line}</div>))}
               </div>
            </div>
         ))}

         {/* Pagination for the results */}
         {visibleStops && <div className={FavoritesCSS.pagination}>
            <Pagination onChange={handlePage} page={page} count={Math.ceil(visibleStops.length / 10)} color="primary" size="small" />
         </div>}
      </div>
   );
};

export default AllStops;