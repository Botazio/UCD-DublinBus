import PlannerCSS from "../Planner.module.css";
import PrimarySearchBarStops from "../../../reusable-components/searchbar-stops/PrimarySearchBarStops";
import SearchButton from "../../../reusable-components/search-button/SearchButton";
import Card from "../../../reusable-components/card/Card";
import RefreshRoundedIcon from '@material-ui/icons/RefreshRounded';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import SelectDepartureTime from "./SelectDepartureTime";
import CustomError from "../../../reusable-components/error/CustomError";
import Waiting from "../../../reusable-components/waiting/Waiting";
import { useState } from "react";
import { useEffect } from "react";
import CustomMarker from "../../../reusable-components/custom-marker/CustomMarker";
import DisplayResults from "./DisplayResults";
import moment from "moment";
import DisplayLine from "../../display-line/DisplayLine";

// This is a subcomponent from the planner search system.
// Allows the user to enter the Origin stop and the Destination stop
const PlannerSearcher = ({ selectedLine, setSelectedLine }) => {
  // States for the different fields the user has to enter 
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(new Date());
  // State for the stops passed to the search bars
  const [validOriginStops, setValidOriginStops] = useState(selectedLine.stops);
  const [validDestinationStops, setValidDestinationStops] = useState(selectedLine.stops);
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

  // Only allow the user to search for stops that accomplish the line sequence order
  useEffect(() => {
    if (destination) {
      setValidOriginStops(selectedLine.stops.filter((stop) => {
        if (stop.stop_sequence < destination.stop_sequence) {
          return stop;
        }
        return false;
      }));
    }
    // eslint-disable-next-line
  }, [destination]);

  useEffect(() => {
    if (origin) {
      setValidDestinationStops(selectedLine.stops.filter((stop) => {
        if (stop.stop_sequence > origin.stop_sequence) {
          return stop;
        }
        return false;
      }));
    }
    // eslint-disable-next-line
  }, [origin]);

  return (
    <>
      {/* Card with the header information */}
      <Card variant="no_margin">
        <div className={PlannerCSS.header_dir_searcher}>
          <div>
            <h4>Line {selectedLine.route__route_short_name}</h4>
            <p>{selectedLine.trip_headsign}</p>
          </div>
          <div>
            <SwapHorizIcon onClick={() => setSelectedLine(null)} />
          </div>
        </div>
      </Card>

      {/* Card to select origin and destination */}
      <Card>
        <div className={PlannerCSS.searchbar_stops_header}>
          <h4>Select stops</h4>
          <div>
            <RefreshRoundedIcon onClick={() => cleanSearch()} />
          </div>
        </div>
        <div className={PlannerCSS.searchbar_stops}>
          <PrimarySearchBarStops placeholder={"Origin stop..."} stops={validOriginStops} selectedStop={origin} setSelectedStop={setOrigin} />
        </div>
        <div className={PlannerCSS.searchbar_stops}>
          <PrimarySearchBarStops placeholder={"Destination stop..."} stops={validDestinationStops} selectedStop={destination} setSelectedStop={setDestination} />
        </div>
      </Card>

      {/* Component to select the departure time */}
      <SelectDepartureTime
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedHour={selectedHour}
        setSelectedHour={setSelectedHour}
      />

      {/* Display the line on the map */}
      <DisplayLine tripId={selectedLine.trip_id} />

      {/* Display markers on the map if origin or destination are selected */}
      {origin &&
        <CustomMarker
          id="origin"
          position={{ lat: origin.stop_lat, lng: origin.stop_lon }}
          options={{
            label: {
              text: "A",
              color: "white"
            },
            zIndex: 100,
          }}
          title={origin.stop_name}
        />}
      {destination &&
        <CustomMarker
          id="destination"
          position={{ lat: destination.stop_lat, lng: destination.stop_lon }}
          options={{
            label: {
              text: "B",
              color: "white"
            },
            zIndex: 100,
          }}
          title={destination.stop_name}
        />}

      {/* Display the results from the search */}
      {searchResults && <DisplayResults searchResults={searchResults} selectedHour={selectedHour} origin={origin} destination={destination} />}

      {/* Display a message if an error occurs during the search */}
      {searchError && <Card variant="margin_bottom"><CustomError height="50" message="Error performing the search" messageSize="1rem" /></Card>}

      {/* Display a waiting icon during the search*/}
      {searchPending && <Card variant="margin_bottom"><Waiting size={50} thickness={3} /></Card>}

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
      "route_id": selectedLine.route_id,
      "direction_id": selectedLine.direction_id,
      "departure_stop_id": origin.stop_id,
      "arrival_stop_id": destination.stop_id,
      "datetime": date + ", " + hour
    };

    fetch("https://dublin-bus.net/predict/", {
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

export default PlannerSearcher;
