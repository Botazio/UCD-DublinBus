import { useGoogleMap } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import MapSwitchCSS from './MapSwitch.module.css';

// This is component is a subcomponent of InfoBar. It is only visible on phone. 
// Allows the user to switch between the map and the info bar.
const MapSwitcher = ({ buttonActive }) => {
   const [mapView, setMapView] = useState(false);
   const map = useGoogleMap();

   // We change the z-index of the map to its initial state every rerender
   useEffect(() => {
      map.getDiv().firstChild.style.zIndex = 0;
      setMapView(false);
   }, [buttonActive, map])

   // We change the z-index of the map depending if the mapView is active
   useEffect(() => {
      if (mapView) {
         map.getDiv().firstChild.style.zIndex = 10;
      }
      if (!mapView) {
         map.getDiv().firstChild.style.zIndex = 0;
      }
   }, [map, mapView])

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