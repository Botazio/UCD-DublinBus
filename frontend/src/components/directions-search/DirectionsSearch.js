import DirectionsSearchCSS from './DirectionsSearch.module.css';
import StopSearchBar from '../stop-searchbar/StopSearchBar';

// This is a subcomponent from the direction search system. 
// Allows the user to enter the Origin stop and the Destination stop
const DirectionsSearch = () => {
   return (
      <>
         <div className={DirectionsSearchCSS.container}>
            <StopSearchBar placeholder={'Origin Stop...'} />
            <StopSearchBar placeholder={'Destination Stop...'} />
         </div>
         <div className={DirectionsSearchCSS.hour_container}>
            <p>Leave at</p>
            <input type="time"></input>
         </div>
      </>
   );
}

export default DirectionsSearch;