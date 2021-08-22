import PrimarySearchBarStops from "../../reusable-components/searchbar-stops/PrimarySearchBarStops";
import StopsCSS from "./Stops.module.css";
import Waiting from "../../reusable-components/waiting/Waiting";
import CustomError from "../../reusable-components/error/CustomError";
import { useEffect, useState } from "react";
import StopBusArrivals from "../stop-bus-arrivals/StopBusArrivals";
import MarkerClusters from "../marker-clusters/MarkerClusters";
import { useGoogleMap } from "@react-google-maps/api";
import MarkersSwitch from "./subcomponents/MarkersSwitch";
import CustomMarker from "../../reusable-components/custom-marker/CustomMarker";
import Card from "../../reusable-components/card/Card";
import PopoverOptions from "../../reusable-components/popover-options/PopoverOptions";
import { useStops } from "../../providers/StopsContext";

// This component is the main component for the stops system.
const Stops = () => {
  // State to select a stop. It is handled by the PrimarySearchBarStops component
  const [selectedStop, setSelectedStop] = useState(null);
  // State for the button that controls if the markers should be displayed
  const [displayMarkers, setDisplayMarkers] = useState(true);

  // reference to the map using the GoogleMap provider
  const mapRef = useGoogleMap();

  // Center the map view to the selected stop position
  useEffect(() => {
    if (selectedStop) {
      mapRef.panTo({ lat: selectedStop.stop_lat, lng: selectedStop.stop_lon });
    }
  }, [mapRef, selectedStop]);

  // Get the data from the provider
  const { data: stops, isPending, error } = useStops();

  // Error handling when fetching for the data
  if (error) return <CustomError height="60" message="Unable to fetch the data" />;

  // Wait for the data
  if (isPending) return <Waiting size={80} thickness={3} />;

  return (
    <>
      <div className={StopsCSS.header}>
        {/* Display the searchbar */}
        <div className={StopsCSS.searchbar}>
          <PrimarySearchBarStops
            placeholder={"Search stop..."}
            stops={stops}
            setSelectedStop={setSelectedStop}
          />
        </div>

        {/* Display the options in a popover */}
        {stops && (
          <div className={StopsCSS.options}>
            <PopoverOptions>
              <MarkersSwitch
                displayMarkers={displayMarkers}
                setDisplayMarkers={setDisplayMarkers}
                mapRef={mapRef}
              />
            </PopoverOptions>
          </div>
        )}
      </div>

      {/* Display the markers and clusters */}
      {displayMarkers && (
        <MarkerClusters
          stops={stops}
          mapRef={mapRef}
          setSelectedStop={setSelectedStop}
        />
      )}

      {/* If there is a stop selected display the next buses*/}
      {selectedStop && (<Card variant="last">
        <h4 className={StopsCSS.stop_bus_times_title}>{selectedStop.stop_name}</h4>
        <StopBusArrivals
          selectedStop={selectedStop}
          setSelectedStop={setSelectedStop}
          size={50}
          thickness={3}
        />
      </Card>
      )}

      {/* If there is a stop selected display a marker at that stop and center the view on it*/}
      {selectedStop && (
        <CustomMarker
          id={selectedStop.stop_id}
          position={{ lat: selectedStop.stop_lat, lng: selectedStop.stop_lon }}
          title={selectedStop.stop_name}
        />
      )}
    </>
  );
};

export default Stops;
