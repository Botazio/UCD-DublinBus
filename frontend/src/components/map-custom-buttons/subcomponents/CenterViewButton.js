import MapCustomButtonsCSS from "../MapCustomButtons.module.css";
import iconCenter from "../fixtures/icon-center-focus.png";

// Centers the user view on Dublin when clicked
const CenterViewButton = ({ mapRef }) => {
   return (
      <div
         className={MapCustomButtonsCSS.button + " " + MapCustomButtonsCSS.button_top}
         onClick={() => centerView(mapRef)}
      >
         <img
            src={iconCenter}
            style={{ width: "20px", height: "20px" }}
            alt={"icon position"}
         />
      </div>
   );

   // Function to center the view again in Dublin
   function centerView() {
      mapRef.panTo({
         lat: 53.349804,
         lng: -6.26031,
      });
      mapRef.setZoom(13);
   }
};

export default CenterViewButton;