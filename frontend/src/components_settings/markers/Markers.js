import { useAuth } from "../../providers/AuthContext";
import MarkersCSS from "./Markers.module.css";
import SettingsHeader from "../../reusable-components/settings-header.js/SettingsHeader";
import { useState } from "react";
import { useEffect } from "react";
import SwitchMarker from "./subcomponents/SwitchMarker";
import MarkerSearchBar from "./subcomponents/MarkerSearchBar";
import PrimaryPagination from "../../reusable-components/custom-pagination/PrimaryPagination";
import { Button } from "@material-ui/core";
import ActionWrapper from "../../reusable-components/action/ActionWrapper";
import ActionMarkers from "../../reusable-components/action/ActionMarkers";
import ContentBox from "../../reusable-components/content-box/ContentBox";

// Messages to display in the header
const markersTitle = "Markers preferences";
const markersBody = "Choose which markers do you want Dublin Bus to display on the map!";

// This is the main component for the markers section
const Markers = () => {
   // Default markers
   const [markers, setMarkers] = useState();
   // Markers to be displayed on the page. They are filtered by the search bar 
   const [visibleMarkers, setVisibleMarkers] = useState();
   // State to control when to display and hide the action message
   const [action, setAction] = useState(false);
   // State for the pagination in the results
   const [page, setPage] = useState(1);

   // Get the current user from the provider
   const { currentUser } = useAuth();

   // Set the initial state for the markers state to the current user markers
   // This function happens the first time the component renders
   useEffect(() => {
      if (currentUser.markers) {
         // Delete the property owner because it does not refer to a type of markers
         delete currentUser.markers.owner;
         setMarkers(currentUser.markers);
         setVisibleMarkers(currentUser.markers);
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

   if (!markers) return "";

   return (
      <>
         {/* Header for the section */}
         <SettingsHeader title={markersTitle} body={markersBody} />

         <ContentBox title="Select markers">
            {/* Search bar */}
            {markers && <MarkerSearchBar markers={markers} setVisibleMarkers={setVisibleMarkers} />}

            {/* Map throught the markers and render a toogle marker button */}
            {Object.keys(visibleMarkers).slice((page - 1) * 10, ((page - 1) * 10) + 10).map((key) => <SwitchMarker key={key} title={key} isActive={markers[key]} handleChange={handleChange} />)}

            {/* Pagination for the results */}
            {visibleMarkers && <div className={MarkersCSS.pagination}>
               <PrimaryPagination onChange={handlePage} page={page} count={Math.ceil(Object.keys(visibleMarkers).length / 10)} size="small" />
            </div>}

            {/* If current user markers are not the same as the local state for markers 
            render a button to save the changes displaying an action */}
            {JSON.stringify(currentUser.markers) !== JSON.stringify(markers) &&
               <div className={MarkersCSS.action_button}>
                  <Button
                     fullWidth={true} variant="outlined" color="primary" onClick={() => setAction(true)}>change markers
                  </Button>
               </div>}
         </ContentBox>

         {/* Display an action if it is active */}
         {action && <ActionWrapper title={"Change markers"} setAction={setAction}>
            <ActionMarkers markers={markers} />
         </ActionWrapper>}
      </>
   );
};

export default Markers;