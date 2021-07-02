import UserLocationButtonCSS from './UserLocationButton.module.css';
import iconPosition from './fixtures/icon-position.png';
import { useState } from 'react';
import { Marker } from '@react-google-maps/api';

// Displays a marker at the user location when it is clicked
const UserLocationButton = ({ mapRef }) => {
   const [position, setPosition] = useState(false);

   return (
      <>
         <div className={UserLocationButtonCSS.button} onClick={() => getUserPosition()}>
            <img
               src={iconPosition}
               style={{ "width": "21px", "height": "21px" }}
               alt={'icon position'} />
         </div>

         {/* Display a marker if we get the position back */}
         {position && (
            <Marker
               key='marker user location'
               position={position}
               options={{
                  map: mapRef,
               }}
               onClick={() => { mapRef.setZoom(14); mapRef.panTo(position); }} />
         )}
      </>
   );

   function getUserPosition() {
      if (!navigator.geolocation) {
         alert("Geolocation is not supported by your browser");
         return;
      }

      console.log(typeof position.lat)

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