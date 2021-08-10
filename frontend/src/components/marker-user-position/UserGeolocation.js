import { useGeolocation } from "../../providers/GeolocationContext";
import iconBlueDot from "../../fixtures/icons/icon-bluedot.png";
import CustomMarker from "../../reusable-components/custom-marker/CustomMarker";

// A marker that is render every 10 seconds using the geolocation provider
// It is render the first time the map renders
const MarkerUserPosition = () => {
   const { position } = useGeolocation();

   // If there is no a user position in the provider return null
   if (!position) return "";

   return (
      /* Display a marker at the user position*/
      <CustomMarker
         id="user-position"
         position={position}
         options={{
            icon: {
               url: iconBlueDot,
               origin: new window.google.maps.Point(0, 0),
               anchor: new window.google.maps.Point(10, 10),
            }
         }}
      />
   );
};

export default MarkerUserPosition;