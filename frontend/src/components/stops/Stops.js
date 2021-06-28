import StopSearchBar from '../stop-searchbar/StopSearchBar';
import SearchButton from '../search-button/SearchButton';
import StopsCSS from './Stops.module.css';

// This component is the main component for the stops system.
// The subcomponents are inserted in this component
const Stops = () => {
   return (
      <>
         <div className={StopsCSS.searchbar}>
            <StopSearchBar placeholder={'Search Stop...'} />
         </div>
         <SearchButton />
      </>
   );
}

export default Stops;