import { Button } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../../../providers/AuthContext";
import CustomError from "../../../../reusable-components/error/CustomError";
import FavoritesCSS from "../../Favorites.module.css";
import StopContainer from "./StopContainer";
import StopsSearchBar from "./StopsSearchBar";
import { useTheme } from "@material-ui/styles";
import { makeStyles } from "@material-ui/styles";
import Action from "../../../../reusable-components/action/Action";

// Button styles
const useStyles = makeStyles((theme) => ({
   root: {
      border: "1px solid" + theme.theme.primary,
      color: theme.theme.primary,
      backgroundColor: theme.theme.background_1
   },
}));

const MyStops = () => {
   // Markers to be displayed on the page. They are filtered by the search bar 
   const [visibleStops, setVisibleStops] = useState();
   // State to control when to display and hide the action message
   const [action, setAction] = useState(false);
   // State for the pagination in the results
   const [page, setPage] = useState(1);
   // State that controls when to display the button to submit the changes
   const [activeStops, setActiveStops] = useState([]);


   // Get the theme from the provider and style the button
   const currentTheme = useTheme();
   const classes = useStyles(currentTheme);

   // Get the user stops from the user provider
   const { currentUser } = useAuth();
   const favoriteStops = currentUser.favouritestops;

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
         <div className={FavoritesCSS.info_box}>
            {/* Search bar */}
            {favoriteStops && <StopsSearchBar stops={favoriteStops} setVisibleStops={setVisibleStops} />}

            {/* Loop through the visible stops and display them */}
            {visibleStops && visibleStops.slice((page - 1) * 5, ((page - 1) * 5) + 5).map((stop) => (
               <StopContainer key={stop.stop_id} stop={stop} activeStops={activeStops} setActiveStops={setActiveStops} type="delete" />
            ))}

            {/* Display a message if the user has not any favorite stops yet */}
            {(favoriteStops.length === 0) && <div className={FavoritesCSS.no_stops_message}><h4>No saved stops</h4></div>}

            {/* Pagination for the results */}
            {visibleStops && <div className={FavoritesCSS.pagination}>
               <Pagination onChange={handlePage} page={page} count={Math.ceil(visibleStops.length / 5)} color="primary" size="small" />
            </div>}

            {/* Action button to save the changes */}
            {(activeStops.length !== 0) && <div className={FavoritesCSS.action_button}>
               <Button
                  classes={{ root: classes.root }} fullWidth={true} onClick={() => setAction(true)}>save changes
               </Button>
            </div>}
         </div>

         {/* Display an action if it is active */}
         {action && <Action message="Change favorite stops" type="fav_stops" color="primary" buttonMessage="Change favorites" setAction={setAction} />}
      </>
   );
};

export default MyStops;