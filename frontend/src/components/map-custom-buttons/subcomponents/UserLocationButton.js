import MapCustomButtonsCSS from "../MapCustomButtons.module.css";
import iconPosition from "../fixtures/icon-position.png";
import { useState } from "react";
import MarkerUserPosition from "../../../reusable-components/custom-marker/CustomMarker";

// Displays a marker at the user location when it is clicked
const UserLocationButton = ({ mapRef }) => {
  const [position, setPosition] = useState(false);

  return (
    <>
      <div
        className={MapCustomButtonsCSS.button + " " + MapCustomButtonsCSS.button_bottom}
        onClick={() => getUserPosition()}
      >
        <img
          src={iconPosition}
          style={{ width: "20px", height: "20px" }}
          alt={"icon position"}
        />
      </div>

      {/* Display a marker if we get the position back */}
      {position && (
        <MarkerUserPosition
          id="user-position"
          position={position}
          mapRef={mapRef}
        />
      )}
    </>
  );

  function getUserPosition() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        mapRef.setZoom(13);
        mapRef.panTo({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => alert(err.message)
    );
  }
};

export default UserLocationButton;
