import DirectionsCSS from "../Directions.module.css";
import StopSearchBar from "../../stop-searchbar/StopSearchBar";
import SearchButton from "../../../reusable-components/search-button/SearchButton";
import Card from "../../../reusable-components/card/Card";
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import SelectDepartureTime from "./SelectDepartureTime";

// This is a subcomponent from the direction search system.
// Allows the user to enter the Origin stop and the Destination stop
const DirectionsSearcher = ({ activeLine, setActiveLine }) => {
  return (
    <>
      {/* Card to select origin and destination */}
      <Card variant="no_margin">
        <div className={DirectionsCSS.header_dir_searcher}>
          <CloseRoundedIcon onClick={() => setActiveLine(null)} />
          <h4>Line {activeLine}</h4>
        </div>
        <div className={DirectionsCSS.searchbar_stops}>
          <StopSearchBar placeholder={"Origin Stop..."} />
        </div>
        <div className={DirectionsCSS.searchbar_stops}>
          <StopSearchBar placeholder={"Destination Stop..."} />
        </div>
      </Card>

      {/* Component to select the departure time */}
      <SelectDepartureTime />

      <SearchButton />
    </>
  );
};

export default DirectionsSearcher;
