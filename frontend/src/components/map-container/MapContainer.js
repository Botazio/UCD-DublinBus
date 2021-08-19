import React, { useState } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import MapContainerCSS from "./MapContainer.module.css";
import lightTheme from "../../fixtures/map-styles/lightTheme";
import darkTheme from "../../fixtures/map-styles/darkTheme";
import greyTheme from "../../fixtures/map-styles/greyTheme";
import { useStops } from "../../providers/StopsContext";
import { useTheme } from "@material-ui/core";
import { useLines } from "../../providers/LinesContext";
import CustomError from "../../reusable-components/error/CustomError";
import Waiting from "../../reusable-components/waiting/Waiting";
import { useAuth } from "../../providers/AuthContext";
import { useEffect } from "react";

// Google map libraries
const libraries = ["places"];

// CSS Styles for the container
const containerStyle = {
  position: "relative",
  width: "100%",
  height: "100%",
};

// Custom options for the map.
const options = {
  mapTypeControl: false,
  fullscreenControl: true,
  streetViewControl: false,
};

// Default options for the map
const defaultOptions = {
  mapTypeControl: false,
  fullscreenControl: true,
  streetViewControl: false,
  styles: lightTheme,
};


// dict for the mapStyles
const mapStyles = {
  "defaultThemeLight": lightTheme,
  "defaultThemeDark": darkTheme,
  "defaultThemeGrey": greyTheme
};

// Center of the map when it loads. In this case Dublin center
const center = {
  lat: 53.349804,
  lng: -6.26031,
};

// This is the main component for the bus page. 
// Loads a google map and wraps all the other components in a context
export default function MapContainer(props) {
  // State to control the map theme
  const [theme, setTheme] = useState();

  // Loads the map
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCLGkrQoHNmMyhdvwl0wmron1ndtREM0zM",
    libraries,
    version: "3.46",
  });

  // Call the providers to load the data for every component
  // It is not a problem to call it multiple times because it only performs the fetch operation
  // the first time
  // We do not need to get the data in any variable
  useStops();
  useLines();

  const { currentUser } = useAuth();
  useEffect(() => {
    // If the user is authenticated set the map to the user preferences
    if (currentUser) {
      handleTheme(mapStyles[currentUser.map]);
    }

  }, [currentUser]);


  // Error handling when loading the map
  if (loadError) return <CustomError message="Error loading maps" height="60" />;
  if (!isLoaded) return <Waiting variant="dark" />;

  return (
    <>
      {/* If there is no user render a default map */}
      {!currentUser && <div className={MapContainerCSS.map_container}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          options={defaultOptions}
        >
          {/* GoogleMap component works as a context around the children */}
          {props.children}
        </GoogleMap>
      </div>}

      {/* If there is a user render a map with his preferences */}
      {currentUser && theme && <div className={MapContainerCSS.map_container}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          options={options}
        >
          {/* GoogleMap component works as a context around the children */}
          {props.children}
        </GoogleMap>
      </div>}

    </>
  );

  // Function to handle the map theme adding google markers to it
  function handleTheme(mapTheme) {
    // Delete the property owner as it refers to the user pk
    delete currentUser.markers.owner;

    const newTheme = [...mapTheme];

    // Loop through the object properties
    for (const key of Object.keys(currentUser.markers)) {
      // Add the markers to the map if active
      if (currentUser.markers[key]) {
        newTheme.push({
          featureType: `poi.${key}`,
          elementType: "all",
          stylers: [
            {
              visibility: "on",
            },
          ]
        });
      }
    }
    setTheme(newTheme);
    options.styles = newTheme;
  }
}
