import { useEffect } from "react";
import { useState } from "react";
import NearMeCSS from "./NearMe.module.css";
import PopoverOptions from "../../reusable-components/popover-options/PopoverOptions";
import Slider from "@material-ui/core/Slider";
import CustomMarker from "../../reusable-components/custom-marker/CustomMarker";
import NearMeStops from "./subcomponents/NearMeStops";
import iconBlueDot from "../../fixtures/icons/icon-bluedot.png";
import { useGoogleMap } from "@react-google-maps/api";
import StopsLinesToogle from "../../reusable-components/stops-lines-toogle/StopsLinesToogle";

// This is the main component for the NearMe section
const NearMe = () => {
   // State to handle when the user is searching for stops or for lines
   const [active, setActive] = useState('stops');
   // State to handle the user position. Could be discard for a context in the future
   const [position, setPosition] = useState(false);
   // State that the user decides on the settings popover
   const [distance, setDistance] = useState(1);
   const [resultsDisplayed, setResultsDisplayed] = useState(20);

   // Hook that gives a ref to the map object
   const mapRef = useGoogleMap();

   // Get the user position the first time the component renders
   useEffect(() => {
      getUserPosition();
      // eslint-disable-next-line
   }, []);

   // function that sets the distance state with the new value
   const handleRange = (event, newValue) => {
      setDistance(newValue);
   };

   // function that sets the maximum number of results with the new value
   const handleResultsDisplayed = (event, newValue) => {
      setResultsDisplayed(newValue);
   };

   return (
      <>
         <div className={NearMeCSS.header}>
            {/* Toogle buttons to select between lines and stops */}
            <StopsLinesToogle active={active} setActive={setActive} />

            {/* Popover options */}
            <div className={NearMeCSS.options}>
               <PopoverOptions>
                  <p>Maximum range (km)</p>
                  <Slider
                     value={distance}
                     onChange={handleRange}
                     aria-labelledby="discrete-slider-custom"
                     valueLabelDisplay="auto"
                     max={10}
                  />
                  <p>Number stops displayed</p>
                  <Slider
                     value={resultsDisplayed}
                     onChange={handleResultsDisplayed}
                     aria-labelledby="discrete-slider-custom"
                     valueLabelDisplay="auto"
                     max={100}
                  />
               </PopoverOptions>
            </div>
         </div>

         {/* Display a marker at the user position*/}
         {position && <CustomMarker
            id="user-position"
            position={position}
            options={{
               icon: {
                  url: iconBlueDot,
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(10, 10),
               }
            }}
         />}

         {/* Display nearme stops when stops is active */}
         {(active === "stops") && <NearMeStops position={position} distance={distance} resultsDisplayed={resultsDisplayed} />}
      </>
   );

   // function that sets the state to the user position and
   // pans the map view to it
   function getUserPosition() {
      if (!navigator.geolocation) {
         alert("Geolocation is not supported by your browser");
         return;
      }

      navigator.geolocation.getCurrentPosition(
         (pos) => {
            setPosition({
               lat: pos.coords.latitude,
               lng: pos.coords.longitude,
            });
            mapRef.panTo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
         },
         (err) => alert(err.message)
      );
   }
};

export default NearMe;