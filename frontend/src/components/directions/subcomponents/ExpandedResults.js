import RoomRoundedIcon from '@material-ui/icons/RoomRounded';
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
import DirectionsCSS from "../Directions.module.css";
import { useTheme } from "@material-ui/core";
import { useState } from 'react';

const ExpandedResults = ({ stopPairs }) => {
   const [expandMiddleStops, setExpandMiddleStops] = useState(false);

   // Grab the theme from the provider
   const theme = useTheme().theme;

   return (
      <div className={DirectionsCSS.expanded_results} >
         {/* Departure div element */}
         <div className={DirectionsCSS.departure}>
            <RoomRoundedIcon />
            <h4>Stop {stopPairs[0].departure_stop}</h4>
            <p>17:53</p>
         </div>

         {/* Middle stations */}
         {(stopPairs.length > 0) && <div className={DirectionsCSS.middle_stops}>
            <div className={DirectionsCSS.middle_stops_header} onClick={() => setExpandMiddleStops(!expandMiddleStops)}>
               <ArrowDropDownRoundedIcon />
               <p>Ride {stopPairs.length - 1} stops</p>
            </div>
            {expandMiddleStops && handleMiddleStops(stopPairs)}
         </div>}

         {/* Arrival div element */}
         <div className={DirectionsCSS.arrival}>
            <RoomRoundedIcon htmlColor={theme.primary} />
            <h4>Stop {stopPairs[stopPairs.length - 1].arrival_stop}</h4>
            <p>17:55</p>
         </div>
      </div>
   );

   function handleMiddleStops(stops) {
      return stops.slice(1).map((stop) => {
         return (
            <div className={DirectionsCSS.middle_stops_data}>
               <FiberManualRecordRoundedIcon fontSize="inherit" />
               <p>Stop {stop.departure_stop}</p>
            </div>
         );
      });
   }
};

export default ExpandedResults;