import { useEffect } from "react";
import { useState } from "react";
import CustomMarker from "../../reusable-components/custom-marker/CustomMarker";
import NearMeStops from "./subcomponents/NearMeStops";
import iconBlueDot from "../../fixtures/icons/icon-bluedot.png";
import { useGoogleMap } from "@react-google-maps/api";

// This is the main component for the NearMe section
const NearMe = () => {
   // State to handle the user position. Could be discard for a context in the future
   const [position, setPosition] = useState(false);

   // Hook that gives a ref to the map object
   const mapRef = useGoogleMap();

   // Get the user position the first time the component renders
   useEffect(() => {
      getUserPosition();
      // eslint-disable-next-line
   }, []);

   return (
      <>
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

         {/* Display nearme stops */}
         <NearMeStops position={position} />
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