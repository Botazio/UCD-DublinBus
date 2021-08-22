import DisplayStopsCSS from './DisplayStops.module.css';
import StopBusArrivals from '../stop-bus-arrivals/StopBusArrivals';
import { useEffect, useState } from 'react';
import iconStop from "../../fixtures/icons/icon-stop.png";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import { AccordionDetails, AccordionSummary } from '@material-ui/core';
import CustomMarker from '../../reusable-components/custom-marker/CustomMarker';
import { useGoogleMap } from '@react-google-maps/api';

// Styles for the accordion
const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.theme.background_primary,
        color: theme.theme.font_color,
        border: `1px solid ${theme.theme.divider}`
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
}));

// This component returns a div and displays a marker for each stop in the array
// This div are wrapped by an accordion
const DisplayStops = ({ stops, page, variant }) => {
    // state to hold which stop has been clicked
    const [activeStop, setActiveStop] = useState();
    // state to control the accordion
    const [expanded, setExpanded] = useState(false);

    // reference to the map using the GoogleMap provider
    const mapRef = useGoogleMap();

    // Calls the current theme and uses it to create the styles for the button
    const currentTheme = useTheme();
    const classes = useStyles(currentTheme);

    // Center the map view to the selected stop position
    useEffect(() => {
        if (activeStop) {
            mapRef.panTo({ lat: activeStop.stop_lat, lng: activeStop.stop_lon });
        }
    }, [mapRef, activeStop]);

    // Disabled the active stop if it is not in the visible stops 
    useEffect(() => {
        if (!stops.includes(activeStop)) setActiveStop(null);
    }, [stops, activeStop]);

    // Set the active stop to false if expanded is false
    useEffect(() => {
        // Variable that avoids updating the component when it is unmounted
        let mounted = true;

        if (!expanded) {
            // Wait for the animation to finish
            setTimeout(() => {
                if (mounted) setActiveStop(null);
            }, 150);
        }

        return () => {
            mounted = false;
        };

    }, [expanded]);

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
                    <div key={"div_" + stop.stop_id} className={DisplayStopsCSS.stop_container} onClick={() => setActiveStop(stop)}>

                        <Accordion classes={{ root: classes.root }} expanded={expanded === stop} onChange={handleChange(stop)} >
                            <AccordionSummary classes={{ expanded: classes.expanded, content: classes.content }}>
                                <div className={DisplayStopsCSS.stop_header}>
                                    <div className={DisplayStopsCSS.stop_title}>
                                        <h4>{stop.stop_name}</h4>
                                        {variant === "near me" && handleDistance(stop.stop_dist)}
                                    </div>
                                    <div className={DisplayStopsCSS.stop_lines_div}>
                                        {stop.stop_lines.map((line, index) => (<div key={line + index}>{line}</div>))}
                                    </div>
                                </div>
                            </AccordionSummary>

                            {/* Only display the accordion details (Next bus arrivals) when that stop is active */}
                            {(activeStop === stop) &&
                                <AccordionDetails >
                                    <div className={DisplayStopsCSS.bus_times}>
                                        <StopBusArrivals selectedStop={activeStop} size={50} thickness={3} />
                                    </div>
                                </AccordionDetails>}

                        </Accordion>
                    </div>
                );
            })}

            {/* Display a red marker on the active stop */}
            {activeStop &&
                <CustomMarker
                    key={"active_marker" + activeStop.stop_id}
                    position={{
                        lat: activeStop.stop_lat,
                        lng: activeStop.stop_lon,
                    }}
                    title={activeStop.stop_name}
                />
            }


            {/* Map the stops array and display a custom marker */}
            {stops.map((stop) => (
                <CustomMarker
                    key={"marker" + stop.stop_id}
                    position={{
                        lat: stop.stop_lat,
                        lng: stop.stop_lon,
                    }}
                    options={{ icon: customIcon }}
                    title={stop.stop_name}
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