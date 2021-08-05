import DirectionsCSS from "../Directions.module.css";
import StopSearchBar from "../../stop-searchbar/StopSearchBar";
import SearchButton from "../../../reusable-components/search-button/SearchButton";
import Card from "../../../reusable-components/card/Card";
import RefreshRoundedIcon from '@material-ui/icons/RefreshRounded';
import SelectDepartureTime from "./SelectDepartureTime";
import { useStops } from "../../../providers/StopsContext";
import CustomError from "../../../reusable-components/error/CustomError";
import Waiting from "../../../reusable-components/waiting/Waiting";
import { useState } from "react";
import { useEffect } from "react";
import CustomMarker from "../../../reusable-components/custom-marker/CustomMarker";
import DisplayDirections from "./DisplayDirections";
import moment from "moment";

// This is a subcomponent from the direction search system.
// Allows the user to enter the Origin stop and the Destination stop
const DirectionsSearcher = ({ selectedLine, setSelectedLine }) => {
  // States for the different fields the user has to enter 
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(new Date());
  // State that when true the search can be performed
  const [searchAvailable, setSearchAvailable] = useState(false);
  // State to handle when the search is being performed
  const [searchPending, setSearchPending] = useState(false);
  // State to display the results 
  const [searchResults, setSearchResults] = useState(null);
  // State to handle the error
  const [searchError, setSearchError] = useState(false);

  // Only allow the search if the user has entered origin and destination
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
      {/* Card with the header information */}
      <Card variant="no_margin">
        <div className={DirectionsCSS.header_dir_searcher}>
          <div>
            <h4>Line {selectedLine.route__route_short_name}</h4>
            <p>{selectedLine.trip_headsign}</p>
          </div>
          <div>
            <RefreshRoundedIcon onClick={() => setSelectedLine(null)} />
          </div>
        </div>
      </Card>

      {/* Card to select origin and destination */}
      <Card>
        <div className={DirectionsCSS.searchbar_stops_header}>
          <h4>Select stops</h4>
          <div>
            <RefreshRoundedIcon onClick={() => cleanSearch()} />
          </div>
        </div>
        <div className={DirectionsCSS.searchbar_stops}>
          <StopSearchBar placeholder={"Origin Stop..."} stops={stops} selectedStop={origin} setSelectedStop={setOrigin} />
        </div>
        <div className={DirectionsCSS.searchbar_stops}>
          <StopSearchBar placeholder={"Destination Stop..."} stops={stops} selectedStop={destination} setSelectedStop={setDestination} />
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
      {searchResults && <DisplayDirections searchResults={searchResults} selectedHour={selectedHour} />}

      {/* Display a message if an error occurs during the search */}
      {searchError && <Card variant="last"><CustomError height="50" message="Error performing the search" messageSize="1rem" /></Card>}

      {/* Display a waiting icon during the search*/}
      {searchPending && <Card variant="last"><Waiting variant="dark" size="small" /></Card>}

      {/* Search Button */}
      <SearchButton searchAvailable={searchAvailable} onClick={() => handleSearch()} />
    </>
  );

  // Function to clean the search
  function cleanSearch() {
    setOrigin(null);
    setDestination(null);
    setSearchAvailable(false);
    setSearchPending(false);
    setSearchResults(null);
    setSearchError(false);
  }

  // Function to handle how the search is performed
  function handleSearch() {
    if (!searchAvailable) return;

    setSearchResults(null);
    setSearchPending(true);
    setSearchError(false);

    // Get the date in the proper format
    const date = moment(selectedDate).format('L');
    const hour = moment(selectedHour).format('HH:mm:ss');

    const body = {
      "route_id": "60-116-d12-1",
      "direction_id": 1,
      "departure_stop_id": "8230DB002955",
      "arrival_stop_id": "8250DB002853",
      "datetime": date + ", " + hour
    };

    fetch("http://csi420-02-vm6.ucd.ie/predict/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error();
        }
        return res.json();
      })
      .then((json) => {
        setSearchPending(false);
        setSearchResults(json);
      })
      .catch((err) => {
        setSearchPending(false);
        setSearchError(true);
      });
  }

};

export default DirectionsSearcher;
