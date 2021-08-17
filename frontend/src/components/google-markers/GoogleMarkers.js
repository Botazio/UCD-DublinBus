import { useGoogleMap } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import geodist from "geodist";
import CustomMarker from "../../reusable-components/custom-marker/CustomMarker";
import { useAuth } from "../../providers/AuthContext";


// This component renders the markers activated in the user settings for different 
// type of places like museums, parks, etc. 
const GoogleMarkers = () => {
   // State to control the markers
   const [markers, setMarkers] = useState([]);
   // State to control the bounds 
   const [bounds, setBounds] = useState();
   // State to control the distance
   const [distance, setDistance] = useState();
   // State to control the active places
   const [activePlaces, setActivePlaces] = useState();

   // Grab the map object from the provider
   const mapRef = useGoogleMap();

   // Grab the user from the provider 
   const { currentUser } = useAuth();

   // Finds the active places selected by the user
   useEffect(() => {
      const activeArray = [];
      if (currentUser) {
         for (const key of Object.keys(currentUser.markers)) {
            if (currentUser.markers[key] && key !== "owner") activeArray.push(key);
         }
      }
      setActivePlaces(activeArray);
   }, [currentUser]);

   // Map event listeners. We add them the first time the component renders
   useEffect(() => {
      // Variable that avoids updating the component when it is unmounted
      let mounted = true;

      mapRef.addListener("idle", () => {
         if (mounted) {
            setDistance(
               Math.round(geodist(
                  { lat: mapRef.getBounds().getSouthWest().lat(), lon: mapRef.getBounds().getSouthWest().lng() },
                  { lat: mapRef.getCenter().lat(), lon: mapRef.getCenter().lng() },
                  { exact: true, unit: 'km' }) * 1000));
            setBounds([
               mapRef.getBounds().getSouthWest().lng(),
               mapRef.getBounds().getSouthWest().lat(),
               mapRef.getBounds().getNorthEast().lng(),
               mapRef.getBounds().getNorthEast().lat(),
            ]);
         }
      });

      // When the components unmounts sets the variable to false 
      // so we can not update the state when moving the map
      // remove event listeners as well for the map object
      return () => {
         mounted = false;
         window.google.maps.event.clearListeners(mapRef, 'idle');
      };
   }, [mapRef]);

   // State to get the markers
   useEffect(() => {
      if (mapRef && distance && activePlaces.length) loadPlaces();
      // eslint-disable-next-line
   }, [mapRef, bounds, activePlaces]);


   if (!currentUser) return "";

   return (
      <>
         {/* map through the markers to display a custom marker */}
         {markers.map((item) => (
            <CustomMarker
               key={item.key}
               options={item.options}
               position={item.position}
               title={item.title} />))}
      </>
   );

   // This function find the user preference places around a variable area
   function loadPlaces() {
      const service = new window.google.maps.places.PlacesService(mapRef);

      let mapCenter = mapRef.getCenter();


      service.nearbySearch(
         { location: mapCenter, radius: distance, type: activePlaces },
         (results, status) => {
            if (status !== "OK" || !results) return;
            if (mapRef.getCenter() !== mapCenter) return;
            addPlaces(results);
         }
      );
   }

   function addPlaces(places) {
      const arrayPlaces = [];


      for (const place of places) {
         if (place.geometry && place.geometry.location && place.business_status === "OPERATIONAL") {
            const icon = {
               url: place.icon,
               origin: new window.google.maps.Point(0, 0),
               anchor: new window.google.maps.Point(9, 9),
               scaledSize: new window.google.maps.Size(18, 18),
            };

            arrayPlaces.push({
               key: place.place_id,
               options: {
                  icon: icon,
                  map: mapRef,
                  zIndex: 10,
               },
               title: place.name,
               position: place.geometry.location,
            });

         }
      }
      setMarkers(arrayPlaces);

   };
};

export default GoogleMarkers;