import { useGoogleMap } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import MapSwitchCSS from './MapSwitch.module.css';

// This is component is a subcomponent of InfoBar. It is only visible on phone. 
// Allows the user to switch between the map and the info bar.
const MapSwitcher = ({ buttonActive }) => {
   const [mapView, setMapView] = useState(false);
   const mapRef = useGoogleMap();

   // We change the z-index of the map to its initial state every rerender
   useEffect(() => {
      mapRef.getDiv().firstChild.style.zIndex = 0;
      setMapView(false);
   }, [buttonActive, mapRef])

   // We change the z-index of the map depending if the mapView is active
   useEffect(() => {
      if (mapView) {
         mapRef.getDiv().firstChild.style.zIndex = 10;
      }
      if (!mapView) {
         mapRef.getDiv().firstChild.style.zIndex = 0;
      }
   }, [mapRef, mapView])

   return (
      <div className={MapSwitchCSS.container}>
         <div
            className={(mapView ? MapSwitchCSS.active : '')}
            onClick={() => setMapView(true)}>
            Map
         </div>
         <div
            className={(mapView ? '' : MapSwitchCSS.active)}
            onClick={() => setMapView(false)}>
            Info
         </div>
      </div>
   );
}

export default MapSwitcher;