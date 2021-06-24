import DirectionsSearchCSS from './DirectionsSearch.module.css';
import StopSearchBar from '../stop-searchbar/StopSearchBar';
import SearchButton from '../search-button/SearchButton';

// This is a subcomponent from the direction search system. 
// Allows the user to enter the Origin stop and the Destination stop
const DirectionsSearch = () => {
   return (
      <>
         <div className={DirectionsSearchCSS.container}>
            <div className={DirectionsSearchCSS.subcontainer}>
               <StopSearchBar placeholder={'Origin Stop...'} />
            </div>
            <div className={DirectionsSearchCSS.subcontainer}>
               <StopSearchBar placeholder={'Destination Stop...'} />
            </div>
         </div>
         <div className={DirectionsSearchCSS.hour_container}>
            <p>Leave at</p>
            <input type="time"></input>
         </div>
         <SearchButton />
      </>
   );
}

export default DirectionsSearch;