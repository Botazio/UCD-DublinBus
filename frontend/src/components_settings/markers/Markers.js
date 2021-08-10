import { useAuth } from "../../providers/AuthContext";
import MarkersCSS from "./Markers.module.css";
import SettingsHeader from "../../reusable-components/settings-header.js/SettingsHeader";
import defaultMarkers from "../../fixtures/markers/defaultMarkers";
import { useState } from "react";
import { useEffect } from "react";
import SwitchMarker from "./subcomponents/SwitchMarker";
import MarkerSearchBar from "./subcomponents/MarkerSearchBar";
import Action from "../../reusable-components/action/Action";
import PrimaryButton from "../../reusable-components/custom-buttons/PrimaryButton";
import PrimaryPagination from "../../reusable-components/custom-pagination/PrimaryPagination";

// Messages to display in the header
const markersTitle = "Markers preferences";
const markersBody = "Choose which markers do you want Dublin Bus to display on the map!";

// This is the main component for the markers section
const Markers = () => {
   // Default markers
   const [markers, setMarkers] = useState(defaultMarkers);
   // Markers to be displayed on the page. They are filtered by the search bar 
   const [visibleMarkers, setVisibleMarkers] = useState(defaultMarkers);
   // State to control when to display and hide the action message
   const [action, setAction] = useState(false);

   // Get the current user from the provider
   const { currentUser } = useAuth();
   // State for the pagination in the results
   const [page, setPage] = useState(1);

   // Set the initial state for the markers state to the current user markers
   // This function happens the first time the component renders
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

   return (
      <>
         {/* Header for the section */}
         <SettingsHeader title={markersTitle} body={markersBody} />

         <div className={MarkersCSS.container}>
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
                  <PrimaryButton
                     fullWidth={true} onClick={() => setAction(true)}>change markers
                  </PrimaryButton>
               </div>}

            {/* Display an action if it is active */}
            {action && <Action message={"Change markers"} type="markers" color="primary" buttonMessage="Change markers" setAction={setAction} />}

         </div>
      </>
   );
};

export default Markers;