import { Marker } from '@react-google-maps/api';
import { useEffect } from 'react';

// small component that creates a marker and centers the view at that position
// if I need something similar later I will create an independent component
const CustomMarker = ({ selectedStop, mapRef }) => {
   useEffect(() => {
      // move the map to the center of the marker
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
         }} />
   );
}

export default CustomMarker;