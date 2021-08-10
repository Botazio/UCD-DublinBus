import { useEffect } from "react";
import NearMeStops from "./subcomponents/NearMeStops";
import { useGeolocation } from "../../providers/GeolocationContext";
import CustomError from "../../reusable-components/error/CustomError";
import { useGoogleMap } from "@react-google-maps/api";

// This is the main component for the NearMe section
const NearMe = () => {
   // Grab the user position from the provider 
   const { position, error } = useGeolocation();

   // Grab the map object from the provider 
   const mapRef = useGoogleMap();

   // Center the view on the user position the first time the component renders
   useEffect(() => {
      if (position) {
         mapRef.panTo({
            lat: position.lat,
            lng: position.lng,
         });
      }
      // eslint-disable-next-line
   }, []);

   // Display an error if we can not get the user position
   if (error) return <CustomError height={60} message={error} />;

   return (
      <>
         {/* Display nearme stops */}
         {position && <NearMeStops position={position} />}
      </>
   );
};

export default NearMe;