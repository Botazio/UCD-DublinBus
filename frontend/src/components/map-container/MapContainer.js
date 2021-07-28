import React from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import MapContainerCSS from "./MapContainer.module.css";
import lightTheme from "../../fixtures/map-styles/lightTheme";
import darkTheme from "../../fixtures/map-styles/darkTheme";
import greyTheme from "../../fixtures/map-styles/greyTheme";
import { useStops } from "../../providers/StopsContext";
import { useTheme } from "@material-ui/core";

// Google map libraries
const libraries = ["places"];

// CSS Styles for the container
const containerStyle = {
  position: "relative",
  width: "100%",
  height: "100%",
};

// Options for the map.
const options = {
  mapTypeControl: false,
  fullscreenControl: true,
  streetViewControl: false,
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
  // Loads the map
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCLGkrQoHNmMyhdvwl0wmron1ndtREM0zM",
    libraries,
    version: "3.46",
  });

  // mapRef to use in other parts of the code without triggering rerenders
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Call the stops hook to load the stops the every time the component renders
  // It is not a problem to call it multiple times because it only performs the fetch operation
  // the first time
  // We do not need to get the data in any variable
  useStops();

  // Render a different map depending on the user settings
  const mapTheme = mapStyles[useTheme().map];
  options.styles = mapTheme;
  // Error handling when loading the map
  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <>
      <div className={MapContainerCSS.map_container}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          options={options}
          onLoad={onMapLoad}
        >
          {/* GoogleMap component works as a context around the children */}
          {props.children}
        </GoogleMap>
      </div>
    </>
  );
}
