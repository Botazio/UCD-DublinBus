import MapCustomButtonsCSS from "../MapCustomButtons.module.css";
import iconPosition from "../fixtures/icon-position.png";
import { useGeolocation } from "../../../providers/GeolocationContext";

// Displays a marker at the user location when it is clicked
const UserLocationButton = ({ mapRef }) => {

  const { position, error } = useGeolocation();

  const panToUserPosition = () => {
    if (position) mapRef.panTo(position);
    if (error) alert("User denied Geolocation");
  };

  return (
    <>
      <div
        className={MapCustomButtonsCSS.button + " " + MapCustomButtonsCSS.button_bottom}
        onClick={() => panToUserPosition()}
      >
        <img
          src={iconPosition}
          style={{ width: "20px", height: "20px" }}
          alt={"icon position"}
        />
      </div>
    </>
  );

};

export default UserLocationButton;
