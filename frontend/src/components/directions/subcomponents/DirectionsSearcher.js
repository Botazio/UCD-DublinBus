import DirectionsCSS from "../Directions.module.css";
import StopSearchBar from "../../stop-searchbar/StopSearchBar";
import SearchButton from "../../../reusable-components/search-button/SearchButton";
import Card from "../../../reusable-components/card/Card";
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import SelectDepartureTime from "./SelectDepartureTime";
import { useStops } from "../../../providers/StopsContext";
import CustomError from "../../../reusable-components/error/CustomError";
import Waiting from "../../../reusable-components/waiting/Waiting";
import { useState } from "react";
import { useEffect } from "react";
import CustomMarker from "../../../reusable-components/custom-marker/CustomMarker";
import DisplayDirections from "./DisplayDirections";

// This is a subcomponent from the direction search system.
// Allows the user to enter the Origin stop and the Destination stop
const DirectionsSearcher = ({ activeLine, setActiveLine }) => {
  // States for the different fields the user has to enter 
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(new Date());
  // State that when true the search can be performed
  const [searchAvailable, setSearchAvailable] = useState(false);

  useEffect(() => {
    if (origin && destination) {
      setSearchAvailable(true);
    }
    else {
      setSearchAvailable(false);
    }
  }, [origin, destination]);

  // Get the data from the provider
  const { data: stops, isPending, error } = useStops();

  // Error handling when fetching for the data
  if (error) return <CustomError height="60" message="Unable to fetch the data" />;

  // Wait for the data
  if (isPending) return <Waiting variant="dark" />;

  return (
    <>
      {/* Card to select origin and destination */}
      <Card variant="no_margin">
        <div className={DirectionsCSS.header_dir_searcher}>
          <CloseRoundedIcon onClick={() => setActiveLine(null)} />
          <h4>Line {activeLine}</h4>
        </div>
        <div className={DirectionsCSS.searchbar_stops}>
          <StopSearchBar placeholder={"Origin Stop..."} stops={stops} setSelectedStop={setOrigin} />
        </div>
        <div className={DirectionsCSS.searchbar_stops}>
          <StopSearchBar placeholder={"Destination Stop..."} stops={stops} setSelectedStop={setDestination} />
        </div>
      </Card>

      {/* Component to select the departure time */}
      <SelectDepartureTime
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedHour={selectedHour}
        setSelectedHour={setSelectedHour}
      />

      {/* Display markers on the map if origin or destination are selected */}
      {origin && <CustomMarker id="origin" position={{ lat: origin.stop_lat, lng: origin.stop_lon }} />}
      {destination && <CustomMarker id="destination" position={{ lat: destination.stop_lat, lng: destination.stop_lon }} />}

      {/* Display the results from the search */}
      {searchAvailable && <DisplayDirections />}
      <SearchButton searchAvailable={searchAvailable} />

    </>
  );
};

export default DirectionsSearcher;
