import DirectionsSearchCSS from "../Directions.module.css";
import StopSearchBar from "../../stop-searchbar/StopSearchBar";
import SearchButton from "../../search-button/SearchButton";

// This is a subcomponent from the direction search system.
// Allows the user to enter the Origin stop and the Destination stop
const DirectionsSearcher = () => {
  return (
    <>
      <div className={DirectionsSearchCSS.container_dir_searcher}>
        <div className={DirectionsSearchCSS.subcontainer_dir_searcher}>
          <StopSearchBar placeholder={"Origin Stop..."} />
        </div>
        <div className={DirectionsSearchCSS.subcontainer_dir_searcher}>
          <StopSearchBar placeholder={"Destination Stop..."} />
        </div>
      </div>
      <div className={DirectionsSearchCSS.hour_container_dir_searcher}>
        <p>Leave at</p>
        <input type="time"></input>
      </div>
      <SearchButton />
    </>
  );
};

export default DirectionsSearcher;
