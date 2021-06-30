import StopSearchBar from '../stop-searchbar/StopSearchBar';
import SearchButton from '../search-button/SearchButton';
import StopsCSS from './Stops.module.css';
import useFetch from '../../helpers/useFetch'

// This component is the main component for the stops system.
// The subcomponents are inserted in this component
const Stops = () => {
   // Fetch the all the stops
   const { data: stops, isPending, error } = useFetch('http://csi420-02-vm6.ucd.ie/dublinbus/stops/');

   return (
      <>
         {stops && console.log(stops)}
         <div className={StopsCSS.searchbar}>
            <StopSearchBar placeholder={'Search Stop...'} />
         </div>
         <SearchButton />
      </>
   );
}

export default Stops;