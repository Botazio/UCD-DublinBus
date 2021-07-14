import ReactDOM from "react-dom";
import { useGoogleMap } from "@react-google-maps/api";
import UserLocationButton from "./subcomponents/UserLocationButton";
import CenterViewButton from "./subcomponents/CenterViewButton";

// This component renders buttons that add functionality on how to control the map.
// The style is similar to a google map button
const MapCustomButtons = () => {
  const mapRef = useGoogleMap();

  // We need to create a portal for the buttons to insert them in the map
  const domNode = mapRef.getDiv().firstChild;

  return (
    <>
      {/* Centers the map view and the zoom level to initial values */}
      {ReactDOM.createPortal(<CenterViewButton mapRef={mapRef} />, domNode)}

      {/* Gets user position and centers the map view at that location */}
      {ReactDOM.createPortal(<UserLocationButton mapRef={mapRef} />, domNode)}
    </>
  );
};

export default MapCustomButtons;
