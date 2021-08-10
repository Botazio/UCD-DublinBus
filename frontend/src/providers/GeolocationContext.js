import { useContext } from "react";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const GeolocationContext = React.createContext();

export function useGeolocation() {
   return useContext(GeolocationContext);
}

// This components provides a context to share the stops across the different components in the application
export function GeolocationProvider({ children }) {
   const [position, setPosition] = useState(null);
   const [error, setError] = useState(null);

   // Fetch the geolocation position every 10 seconds
   useEffect(() => {
      const interval = setInterval(getUserPosition(), 10000);
      return () => clearInterval(interval);
   }, []);

   // function that sets the state to the user position and
   // pans the map view to it
   function getUserPosition() {
      if (!navigator.geolocation) {
         setError("Geolocation not supported");
         alert("Geolocation is not supported by your browser");
         return;
      }

      navigator.geolocation.getCurrentPosition(
         (pos) => {
            setPosition({
               lat: pos.coords.latitude,
               lng: pos.coords.longitude,
            });
            setError(null);
         },
         (err) => {
            setError(err.message);
            setPosition(null);
            alert(err.message);
         }
      );
   }

   const value = {
      position,
      error
   };

   return <GeolocationContext.Provider value={value}>{children}</GeolocationContext.Provider>;
}