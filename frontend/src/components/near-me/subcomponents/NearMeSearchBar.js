import StopsSearchBar from "../../../reusable-components/stops-searchbar/StopsSearchBar";
import NearMeCSS from "../NearMe.module.css";

const NearMeSearchBar = ({ stops, setVisibleStops }) => {
   return (
      <div className={NearMeCSS.searchbar_container}>
         <StopsSearchBar
            placeholder={"Search Stop..."}
            stops={stops}
            setVisibleStops={setVisibleStops}
            classes={NearMeCSS.searchbar}
         />
      </div>
   );
};

export default NearMeSearchBar;