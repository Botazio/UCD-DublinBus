import NearMeCSS from '../NearMe.module.css';
import StopBusArrivals from '../../stop-bus-arrivals/StopBusArrivals';
import { useState } from 'react';
import iconStop from "../../../fixtures/icons/icon-stop.png";
import { withStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { AccordionDetails } from '@material-ui/core';
import CustomMarker from '../../../reusable-components/custom-marker/CustomMarker';

// Styles for the accordion
const AccordionSummary = withStyles({
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

// This component returns a div and displays a marker for each stop in the array
// This div are wrapped by an accordion
const DisplayStops = ({ stops, page }) => {
    // state to hold which stop has been clicked
    const [activeStop, setActiveStop] = useState("");
    // state to control the accordion
    const [expanded, setExpanded] = useState(false);

    const handleChange = (stop) => (event, isExpanded) => {
        setExpanded(isExpanded ? stop : false);
    };

    // Custom options for the stops marker
    var customIcon = {
        url: iconStop,
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(10, 10),
    };


    return (
        <>
            {/* Displays 10 results per page */}
            {stops.slice((page - 1) * 10, ((page - 1) * 10) + 10).map((stop) => {
                return (
                    <div key={"div_" + stop.stop_id} className={NearMeCSS.stop_container} onClick={() => setActiveStop(stop)}>

                        <Accordion expanded={expanded === stop} onChange={handleChange(stop)} >
                            <AccordionSummary>
                                <div className={NearMeCSS.stop_header}>
                                    <div className={NearMeCSS.stop_title}>
                                        <h4>{stop.stop_name}</h4>
                                        {handleDistance(stop.stop_dist)}
                                    </div>
                                    <div className={NearMeCSS.stop_lines_div}>
                                        {stop.stop_lines.map((line, index) => (<div key={line + index}>{line}</div>))}
                                    </div>
                                </div>
                            </AccordionSummary>

                            {/* Only display the accordion details (Next bus arrivals) when that stop is active */}
                            {(activeStop === stop) &&
                                <AccordionDetails>
                                    <div className={NearMeCSS.bus_times}>
                                        <StopBusArrivals selectedStop={activeStop} waitingColor="dark" waitingSize="small" />
                                    </div>
                                </AccordionDetails>}

                        </Accordion>
                    </div>
                );
            })}

            {/* Map the stops array and display a custom marker */}
            {stops.map((stop) => (
                <CustomMarker
                    key={"marker" + stop.stop_id}
                    position={{
                        lat: stop.stop_lat,
                        lng: stop.stop_lon,
                    }}
                    options={{ icon: customIcon }}
                />
            ))}
        </>
    );

    // Function that controls how to display the distance
    // Displays km if the distance is more than 1 km
    function handleDistance(dist) {
        // if the distance is less than a km return the units in meters
        if (dist < 1) {
            return <h4>{Math.round(dist * 1000)}m</h4>;
        }

        return <h4>{Math.round(dist + 100) / 100}km</h4>;

    }
};

export default DisplayStops;