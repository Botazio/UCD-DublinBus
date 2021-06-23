import { useState } from 'react';
import MapSwitcherCSS from './MapSwitcher.module.css';

// This is component is a subcomponent of InfoBar. It is only visible on phone. 
// Allows the user to switch between the map and the info bar.
const MapSwitcher = () => {
   const [mapView, setMapView] = useState(false);

   return (
      <div className={MapSwitcherCSS.container}>
         <div
            className={(mapView ? MapSwitcherCSS.active : '')}
            onClick={() => setMapView(true)}>
            Map
         </div>
         <div
            className={(mapView ? '' : MapSwitcherCSS.active)}
            onClick={() => setMapView(false)}>
            Info
         </div>
      </div>
   );
}

export default MapSwitcher;