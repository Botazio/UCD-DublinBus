import DirectionsSearchCSS from "../Directions.module.css";
import StopSearchBar from "../../stop-searchbar/StopSearchBar";
import StopsCSS from "../../stops/Stops.module.css";
import { useState } from "react";
import { useStops } from "../../../providers/StopsContext";
import Waiting from "../../../reusable-components/waiting/Waiting";
import CustomError from "../../../reusable-components/error/CustomError";
import Card from "../../../reusable-components/card/Card";
import StopBusArrivals from "../../stop-bus-arrivals/StopBusArrivals";

// This is a subcomponent from the direction search system.
// Allows the user to enter the Origin stop and the Destination stop
const DirectionsSearcher = () => {

  // State to select a stop. It is handled by the StopSearchBar component
  const [selectedDepartureStop, setSelectedDepartureStop] = useState(null);

  const [selectedArrivalStop, setSelectedArrivalStop] = useState(null);

  // Get all stops
  const { data: stops, isPending, error } = useStops();

  // Error handling when fetching for the data
  if (error) return <CustomError height="60" message="Unable to fetch the data" />;

  // Wait for the data
  if (isPending) return <Waiting />;

  return (
    <>
      <div className={DirectionsSearchCSS.container_dir_searcher}>
        <div className={DirectionsSearchCSS.subcontainer_dir_searcher}>
          <StopSearchBar placeholder={"Origin Stop..."} stops={stops} setSelectedStop={setSelectedDepartureStop}/>
        </div>
        <div className={DirectionsSearchCSS.subcontainer_dir_searcher}>
          <StopSearchBar placeholder={"Destination Stop..."} stops={stops} setSelectedStop={setSelectedArrivalStop}/>
        </div>
      </div>
      <div className={DirectionsSearchCSS.hour_container_dir_searcher}>
        <p>Leave at</p>
        <input type="time"></input>
      </div>

      {selectedDepartureStop && selectedArrivalStop && (<Card variant="last">
        <h4 className={StopsCSS.stop_bus_times_title}>{selectedDepartureStop.stop_name}</h4>
        <StopBusArrivals
          selectedStop={selectedDepartureStop}
          setSelectedStop={setSelectedDepartureStop}
        />
        <StopBusArrivals
          selectedStop={selectedArrivalStop}
          setSelectedStop={setSelectedArrivalStop}
        />
      </Card>
      )}
    </>
  );
};

export default DirectionsSearcher;
