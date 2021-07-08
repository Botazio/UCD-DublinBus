import ReactDOM from 'react-dom'
import MapCustomButtonsCSS from './MapCustomButtons.module.css';
import { useGoogleMap } from '@react-google-maps/api';
import iconCenter from './fixtures/icon-center-focus.png';
import UserLocationButton from '../user-location-button/UserLocationButton';

// This component renders buttons related with the map.
// The style is similar to a google map button
const MapCustomButtons = () => {
   const mapRef = useGoogleMap();

   // We need to create a portal for the buttons to insert them in the map
   const domNode = mapRef.getDiv().firstChild;

   // Center view button
   const centerViewButton = (
      <div className={MapCustomButtonsCSS.center_view_button} onClick={() => centerView(mapRef)}>
         <img
            src={iconCenter}
            style={{ "width": "20px", "height": "20px" }}
            alt={'icon position'} />
      </div>
   )

   return (
      <>
         {/* Centers the map view and the zoom level to initial values */}
         {ReactDOM.createPortal(centerViewButton, domNode)}

         {/* Gets user position and centers the map view at that location */}
         {ReactDOM.createPortal(<UserLocationButton mapRef={mapRef} />, domNode)}
      </>
   );

   // Function to center the view again in Dublin 
   function centerView() {
      mapRef.panTo({
         lat: 53.349804,
         lng: -6.26031
      });
      mapRef.setZoom(13);
   }
}

export default MapCustomButtons;