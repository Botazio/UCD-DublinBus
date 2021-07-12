import StopSearchBar from '../stop-searchbar/StopSearchBar';
import StopsCSS from './Stops.module.css';
import useFetch from '../../helpers/useFetch'
import Waiting from '../waiting/Waiting';
import FetchError from '../fetch-error/FetchError';
import { useState } from 'react';
import StopBusTimes from '../stop-bus-times/StopBusTimes';
import MarkerClusters from '../marker-clusters/MarkerClusters';
import { useGoogleMap } from '@react-google-maps/api';
import MarkersSwitch from '../markers-switch/MarkersSwitch';
import CustomMarker from '../custom-marker/CustomMarker';

// This component is the main component for the stops system.
// The subcomponents are inserted in this component
const Stops = () => {
   // State to select a stop. It is handled by the StopSearchBar component
   const [selectedStop, setSelectedStop] = useState(null);
   // State for the button that controls if the markers should be displayed
   const [displayMarkers, setDisplayMarkers] = useState(true);

   // reference to the map
   const mapRef = useGoogleMap();

   // Fetch the all the stops
   const { data: stops, isPending, error } = useFetch('http://localhost:8000/dublinbus/stops/');

   // Error handling when fetching for the data
   if (error) return (<FetchError height="60" message="Unable to fetch the data" />)

   // Wait for the data
   if (isPending) return <Waiting />;

   return (
      <>
         {/* Display the searchbar */}
         <div className={StopsCSS.searchbar}>
            <StopSearchBar placeholder={'Search Stop...'} stops={stops} setSelectedStop={setSelectedStop} />
         </div>

         {/* Display the button that controls when to display the markers */}
         {stops && <MarkersSwitch displayMarkers={displayMarkers} setDisplayMarkers={setDisplayMarkers} mapRef={mapRef} />}

         {/* Display the markers and clusters */}
         {displayMarkers && <MarkerClusters stops={stops} mapRef={mapRef} setSelectedStop={setSelectedStop} />}

         {/* If there is a stop selected display the next buses*/}
         {selectedStop && <StopBusTimes selectedStop={selectedStop} setSelectedStop={setSelectedStop} />}

         {/* If there is a stop selected display a marker at that stop */}
         {selectedStop && <CustomMarker
            id={selectedStop.stop_id}
            position={{ lat: selectedStop.stop_lat, lng: selectedStop.stop_lon }}
            mapRef={mapRef} />}
      </>
   );

}

export default Stops;
