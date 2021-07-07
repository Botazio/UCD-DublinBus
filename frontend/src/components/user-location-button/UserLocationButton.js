import UserLocationButtonCSS from './UserLocationButton.module.css';
import iconPosition from './fixtures/icon-position.png';
import { useState } from 'react';
import CustomMarker from '../custom-marker/CustomMarker';
import userPosition from './fixtures/user-position.png';

// Displays a marker at the user location when it is clicked
const UserLocationButton = ({ mapRef }) => {
   const [position, setPosition] = useState(false);

   const customIcon = {
      url: userPosition,
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(26, 26)
   }

   return (
      <>
         <div className={UserLocationButtonCSS.button} onClick={() => getUserPosition()}>
            <img
               src={iconPosition}
               style={{ "width": "20px", "height": "20px" }}
               alt={'icon position'} />
         </div>

         {/* Display a marker if we get the position back */}
         {position && <CustomMarker id="user-position" position={position} iconType={customIcon} mapRef={mapRef} />}
      </>
   );

   function getUserPosition() {
      if (!navigator.geolocation) {
         alert("Geolocation is not supported by your browser");
         return;
      }

      navigator.geolocation.getCurrentPosition((position) => {
         setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
         });
         mapRef.setZoom(13);
         mapRef.panTo({
            lat: position.coords.latitude,
            lng: position.coords.longitude
         });

      }, (err) => alert(err.message))
   }
}

export default UserLocationButton;