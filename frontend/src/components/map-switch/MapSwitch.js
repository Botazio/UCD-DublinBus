import { useGoogleMap } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import MapSwitchCSS from "./MapSwitch.module.css";
import { ReactComponent as IconMap } from "../../fixtures/icons/icon-map.svg";
import { ReactComponent as IconInfo } from "../../fixtures/icons/icon-info.svg";
import { useTheme } from "@material-ui/core";

// This component is only visible on phone and tablets.
// Allows the user to switch between the map and the info bar changing the z-index of the map.
const MapSwitcher = ({ buttonActive }) => {
  const [mapView, setMapView] = useState(false);

  // Hook to access the map object
  const mapRef = useGoogleMap();

  // Grab the theme from the provider
  const theme = useTheme().theme;

  // We change the z-index of the map to its initial state every time this component rerenders
  useEffect(() => {
    mapRef.getDiv().firstChild.style.zIndex = 0;
    setMapView(false);
  }, [buttonActive, mapRef]);

  // We change the z-index of the map depending if the mapView is active
  // The mapView state is change clicking on the buttons
  useEffect(() => {
    if (mapView) {
      mapRef.getDiv().firstChild.style.zIndex = 10;
    }
    if (!mapView) {
      mapRef.getDiv().firstChild.style.zIndex = 0;
    }
  }, [mapRef, mapView]);

  return (
    <div className={MapSwitchCSS.container} style={{ backgroundColor: theme.background_primary }}>
      {/* Sets the map view to true */}
      <div
        style={mapView ? { backgroundColor: theme.primary } : { backgroundColor: theme.background_primary }}
        onClick={() => setMapView(true)}>
        <IconMap height={20} width={20} fill={mapView ? theme.background_primary : theme.icon_color + 80} />
        <p style={mapView ? { color: theme.background_primary } : { color: theme.font_color }}>Map</p>
      </div>
      {/* Sets the map view to false */}
      <div
        style={!mapView ? { backgroundColor: theme.primary } : { backgroundColor: theme.background_primary }}
        onClick={() => setMapView(false)}>
        <IconInfo height={20} width={20} fill={!mapView ? theme.background_primary : theme.icon_color + 80} />
        <p style={!mapView ? { color: theme.background_primary } : { color: theme.font_color }}>Info</p>
      </div>
    </div>
  );
};

export default MapSwitcher;
