import { useAuth } from "../../providers/AuthContext";
import MarkersCSS from "./Markers.module.css";
import SettingsHeader from "../../reusable-components/settings-header.js/SettingsHeader";
import defaultMarkers from "../../fixtures/markers/defaultMarkers";
import { useState } from "react";
import { useEffect } from "react";
import SwitchMarker from "./subcomponents/SwitchMarker";
import Pagination from "@material-ui/lab/Pagination";
import MarkerSearchBar from "./subcomponents/MarkerSearchBar";
import Action from "../../reusable-components/action/Action";
import { Button, makeStyles, useTheme } from "@material-ui/core";

// Messages to display in the reusable components
const markersTitle = "Markers preferences";
const markersBody = "Choose which markers do you want Dublin Bus to display on the map!";

// Button styles
const useStyles = makeStyles((theme) => ({
   root: {
      border: "1px solid" + theme.theme.primary,
      color: theme.theme.primary,
      backgroundColor: theme.theme.background_1
   },
}));

// This is the main component for the markers section
const Markers = () => {
   // Default markers
   const [markers, setMarkers] = useState(defaultMarkers);
   // Markers to be displayed on the page. They are filtered by the search bar 
   const [visibleMarkers, setVisibleMarkers] = useState(defaultMarkers);
   // State to control when to display and hide the action message
   const [action, setAction] = useState(false);

   // Get the theme from the provider and style the button
   const currentTheme = useTheme();
   const classes = useStyles(currentTheme);

   // Get the current user from the provider
   const { currentUser } = useAuth();
   // State for the pagination in the results
   const [page, setPage] = useState(1);

   useEffect(() => {
      if (currentUser && currentUser.markers) {
         setMarkers(currentUser.markers);
      }
   }, [currentUser]);

   // function that sets the results page with the new value
   const handlePage = (event, value) => {
      setPage(value);
   };

   // function that controls the event when a switch is clicked
   function handleChange(title, state) {
      setMarkers({ ...markers, [title]: !state });
   };

   const actionMessage = "Change markers";

   return (
      <>
         <SettingsHeader title={markersTitle} body={markersBody} />

         {/* Search bar */}
         {markers && <MarkerSearchBar markers={markers} setVisibleMarkers={setVisibleMarkers} />}

         {/* Map throught the markers and render a toogle marker button */}
         {Object.keys(visibleMarkers).slice((page - 1) * 10, ((page - 1) * 10) + 10).map((key) => <SwitchMarker key={key} title={key} isActive={markers[key]} handleChange={handleChange} />)}

         {/* Pagination for the results */}
         {visibleMarkers && <div className={MarkersCSS.pagination}>
            <Pagination onChange={handlePage} page={page} count={Math.ceil(Object.keys(visibleMarkers).length / 10)} color="primary" size="small" />
         </div>}

         {/* Action button to save the changes */}
         {JSON.stringify(currentUser.markers) !== JSON.stringify(markers) &&
            <div className={MarkersCSS.action_button}>
               <Button
                  classes={{ root: classes.root }} fullWidth={true} onClick={() => setAction(true)}>change markers
               </Button>
            </div>}

         {/* Display an action if it is active */}
         {action && <Action message={actionMessage} type="markers" color="primary" buttonMessage="Change markers" setAction={setAction} />}
      </>
   );
};

export default Markers;