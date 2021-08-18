import { Polyline, useGoogleMap } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import useFetch from "../../helpers/useFetch";
import CustomMarker from "../../reusable-components/custom-marker/CustomMarker";
import iconStop from "../../fixtures/icons/icon-stop.png";

// Options for the polyline
const options = (color) => ({
   strokeColor: color,
   strokeOpacity: 0.7,
   strokeWeight: 6,
   clickable: false,
   draggable: false,
   editable: false,
   visible: true,
   radius: 30000,
   zIndex: 1
});


const DisplayLine = ({ tripId }) => {
   // State to handle the path of the line
   const [path, setPath] = useState();

   // Options for the polyline
   const customOptions = options("#4285F4");

   // Options for the icon
   const icon = {
      url: iconStop,
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(8, 8),
      scaledSize: new window.google.maps.Size(16, 16),
   };

   // Center the view in the line after is loaded
   const mapRef = useGoogleMap();
   const centerMap = () => {
      if (!shape) return;

      var bounds = new window.google.maps.LatLngBounds();
      const len = shape.length - 1;
      bounds.extend({ lat: shape[0].shape_pt_lat, lng: shape[0].shape_pt_lon });
      bounds.extend({ lat: shape[len].shape_pt_lat, lng: shape[len].shape_pt_lon });
      // Set the map view to the bounds
      mapRef.fitBounds(bounds);
   };

   // Get the data from the backend
   const { data: shape, isPending: isPendingShape, error: errorShape } = useFetch("https://csi420-02-vm6.ucd.ie/shape_by_trip/" + tripId);
   const { data: stops, isPending: isPendingStops, error: errorStops } = useFetch("https://csi420-02-vm6.ucd.ie/stops_by_trip/" + tripId);

   // Get the line path
   useEffect(() => {
      if (shape) {
         // Set the path
         const points = shape.map((point) => {
            return { lat: point.shape_pt_lat, lng: point.shape_pt_lon };
         });
         setPath(points);
      }

   }, [shape]);


   // Error handling when fetching for the data
   if (errorShape || errorStops) return alert("Unable to display the line on the map");

   // Wait for the data
   if (isPendingShape || isPendingStops) return "";

   // Return until we get the path for the polyline
   if (!path || !stops) return "";

   return (
      <>
         {/* Display the line path*/}
         <Polyline
            options={customOptions}
            path={path}
            onLoad={centerMap}
         />

         {/* Display the stops in that line */}
         {stops.map((stop) => {
            return (
               <CustomMarker
                  key={stop.stop_id}
                  options={{
                     icon: icon,
                     map: mapRef,
                     zIndex: 10,
                  }}
                  position={{ lat: stop.stop_lat, lng: stop.stop_lon }}
                  title={stop.stop_name}
               />
            );

         })}
      </>
   );
};

export default DisplayLine;