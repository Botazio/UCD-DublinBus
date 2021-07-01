import React from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import MapContainerCSS from './MapContainer.module.css';
import mapStyles from '../../fixtures/map-styles/mapStyles';

const libraries = ["places"];
const containerStyle = {
   position: 'relative',
   width: '100%',
   height: '100%'
};

const options = {
   styles: mapStyles,
   mapTypeControl: false,
   fullscreenControl: false
}

const center = {
   lat: 53.349804,
   lng: -6.26031
};



export default function MapContainer(props) {
   // Loads the map
   const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: "AIzaSyCLGkrQoHNmMyhdvwl0wmron1ndtREM0zM",
      libraries,
      version: "3.46"
   });

   // mapRef to use in other parts of the code without triggering rerenders
   const mapRef = React.useRef();
   const onMapLoad = React.useCallback((map) => {
      mapRef.current = map;
   }, []);

   // Error handling when loading the map
   if (loadError) return "Error loading maps";
   if (!isLoaded) return "Loading Maps";

   return (
      <>
         <div className={MapContainerCSS.map_container}>
            <GoogleMap
               mapContainerStyle={containerStyle}
               center={center}
               zoom={13}
               options={options}
               onLoad={onMapLoad}
            >
               {/* GoogleMap component works as a context around the children */}
               {props.children}
            </GoogleMap>
         </div>
      </>
   );
}
