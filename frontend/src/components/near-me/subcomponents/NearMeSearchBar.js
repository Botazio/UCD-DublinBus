import SecondarySearchBarStops from "../../../reusable-components/searchbar-stops/SecondarySearchBarStops";
import NearMeCSS from "../NearMe.module.css";

const NearMeSearchBar = ({ stops, setVisibleStops }) => {
   return (
      <div className={NearMeCSS.searchbar_container}>
         <SecondarySearchBarStops
            placeholder={"Search Stop..."}
            stops={stops}
            setVisibleStops={setVisibleStops}
            classes={NearMeCSS.searchbar}
         />
      </div>
   );
};

export default NearMeSearchBar;