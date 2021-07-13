import { Marker } from "@react-google-maps/api";
import { useEffect } from "react";
import iconBluedot from "../../fixtures/icon-bluedot.png";

// This is a special marker use to display the user position
const MarkerUserPosition = ({ id, position, mapRef }) => {
   useEffect(() => {
      // move the map view to the center of the marker
      //mapRef.panTo(position);
   }, [position, mapRef]);


   return (
      <Marker
         key={id}
         position={{
            lat: 53.349804,
            lng: -6.26031,
         }}
         options={{
            icon: iconBluedot,
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(10, 10),
            map: mapRef,
            zIndex: 1000,
         }}
      //onClick={() => handleClick()}
      />
   );

   // zoom the view if the user clicks on the marker
   function handleClick() {
      const zoom = mapRef.getZoom();

      // zooms more the higher is the view
      if (zoom <= 13) {
         mapRef.setZoom(zoom + 2);
      } else if (13 < zoom && zoom <= 16) {
         mapRef.setZoom(zoom + 1);
      }

      // pans the view to the marker
      mapRef.panTo(position);
   }
};

export default MarkerUserPosition;