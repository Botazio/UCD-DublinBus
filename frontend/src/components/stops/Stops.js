import StopSearchBar from '../stop-searchbar/StopSearchBar';
import StopsCSS from './Stops.module.css';
import useFetch from '../../helpers/useFetch'
import Waiting from '../waiting/Waiting';
import { useState } from 'react';
import StopBusTimes from '../stop-bus-times/StopBusTimes';

// This component is the main component for the stops system.
// The subcomponents are inserted in this component
const Stops = () => {
   // State to select a stop. It is handled by the StopSearchBar component
   const [selectedStop, setSelectedStop] = useState(null);

   // Fetch the all the stops
   const { data: stops, isPending, error } = useFetch('http://csi420-02-vm6.ucd.ie/dublinbus/stops/');

   // Error handling when fetching for the data
   if (error) return (<div>Unable to get the stops data</div>)

   // Wait for the data
   if (isPending) return <Waiting />;

   return (
      <>
         <div className={StopsCSS.searchbar}>
            <StopSearchBar placeholder={'Search Stop...'} stops={stops} setSelectedStop={setSelectedStop} />
         </div>
         {selectedStop && <StopBusTimes selectedStop={selectedStop} />}
      </>
   );

}

export default Stops;