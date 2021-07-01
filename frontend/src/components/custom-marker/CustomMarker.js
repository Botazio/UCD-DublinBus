import { Marker } from '@react-google-maps/api';
import { useEffect } from 'react';

// small component that creates a marker and centers the view at that position
// if I need something similar later I will create an independent component
const CustomMarker = ({ selectedStop, mapRef }) => {
   useEffect(() => {
      // move the map view to the center of the marker
      mapRef.panTo({
         lat: selectedStop.stop_lat,
         lng: selectedStop.stop_lon
      });

   }, [selectedStop, mapRef])

   return (
      <Marker
         key={'selected-stop-marker'}
         position={{
            lat: selectedStop.stop_lat,
            lng: selectedStop.stop_lon
         }}
         options={{
            map: mapRef,
            zIndex: 1000
         }}
         onClick={() => handleClick()} />
   );

   // zoom the view if the user clicks on the marker
   function handleClick() {
      const zoom = mapRef.getZoom();

      // zooms more the higher is the view
      if (zoom <= 13) {
         mapRef.setZoom(zoom + 2);
      }
      else if (13 < zoom && zoom <= 16) {
         mapRef.setZoom(zoom + 1);
      }

      // pans the view to the marker
      mapRef.panTo({
         lat: selectedStop.stop_lat,
         lng: selectedStop.stop_lon
      });
   }
}

export default CustomMarker;