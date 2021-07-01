import MapCustomButtonsCSS from './MapCustomButtons.module.css';
import { useGoogleMap } from '@react-google-maps/api';
import iconCenter from './fixtures/icon-center-focus.png';

// this component renders buttons related with the map.
// the style is similar to a google map button
const MapCustomButtons = () => {
   const mapRef = useGoogleMap();

   return (
      <>
         {/* centers the map view and the zoom level to initial values */}
         <div className={MapCustomButtonsCSS.center_view_button} onClick={() => centerView(mapRef)}>
            <img
               src={iconCenter}
               style={{ "width": "20px", "height": "20px" }}
               alt={'icon position'} />
         </div>
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