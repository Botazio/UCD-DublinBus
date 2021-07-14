import NearMeCSS from '../NearMe.module.css';
import StopBusTimes from '../../stop-bus-times/StopBusTimes';
import { useState } from 'react';
import { Marker } from '@react-google-maps/api';
import iconStop from "../../../fixtures/icons/icon-stop.png";
import CustomError from '../../../reusable-components/error/CustomError';
import { withStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { AccordionDetails } from '@material-ui/core';

const AccordionSummary = withStyles({
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

// this component returns a div and displays a marker for each stop in the array
const DisplayStops = ({ stops, mapRef, page }) => {
    // state to hold which stop has been clicked
    const [activeStop, setActiveStop] = useState("");
    // state to control the accordion
    const [expanded, setExpanded] = useState(false);

    const handleChange = (stop) => (event, isExpanded) => {
        setExpanded(isExpanded ? stop : false);
    };

    // custom options for the stops marker
    var customIcon = {
        url: iconStop,
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(10, 10),
    };

    if (stops === "no stops") {
        return (<CustomError message="No stops around" height={60} />);
    }

    return (
        <>
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

                            {(activeStop === stop) &&
                                <AccordionDetails>
                                    <div className={NearMeCSS.bus_times}>
                                        <StopBusTimes selectedStop={activeStop} waitingColor="dark" waitingSize="small" />
                                    </div>
                                </AccordionDetails>}

                        </Accordion>
                    </div>
                );
            })}

            {stops.map((stop) => (
                <Marker
                    key={"marker" + stop.stop_id}
                    position={{
                        lat: stop.stop_lat,
                        lng: stop.stop_lon,
                    }}
                    options={{
                        map: mapRef,
                        icon: customIcon,
                    }}
                />
            ))}
        </>
    );

    function handleDistance(dist) {
        // if the distance is less than a km return the units in meters
        if (dist < 1) {
            return <h4>{Math.round(dist * 1000)}m</h4>;
        }

        return <h4>{Math.round(dist + 100) / 100}km</h4>;

    }
};

export default DisplayStops;