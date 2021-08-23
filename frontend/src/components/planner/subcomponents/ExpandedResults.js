import RoomRoundedIcon from '@material-ui/icons/RoomRounded';
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
import PlannerCSS from "../Planner.module.css";
import { useTheme } from "@material-ui/core";
import { useState } from 'react';
import moment from "moment";

const ExpandedResults = ({ searchResults, selectedHour }) => {
   const [expandMiddleStops, setExpandMiddleStops] = useState(false);

   // Get the stop pairs from the searchResults object
   let stopPairs = searchResults.stop_pairs;

   // Grab the theme from the provider
   const theme = useTheme().theme;

   return (
      <div className={PlannerCSS.expanded_results} >
         {/* Departure div element */}
         <div className={PlannerCSS.departure}>
            <RoomRoundedIcon />
            <h4>Stop {stopPairs[0].departure_stop}</h4>
            <p>{moment(selectedHour).format('HH:mm')}</p>
         </div>

         {/* Middle stations */}
         {(stopPairs.length > 0) && <div className={PlannerCSS.middle_stops}>
            <div className={PlannerCSS.middle_stops_header} onClick={() => setExpandMiddleStops(!expandMiddleStops)}>
               <ArrowDropDownRoundedIcon />
               <p>Ride {stopPairs.length - 1} stops</p>
            </div>
            {expandMiddleStops && handleMiddleStops(stopPairs)}
         </div>}

         {/* Arrival div element */}
         <div className={PlannerCSS.arrival}>
            <RoomRoundedIcon htmlColor={theme.primary} />
            <h4>Stop {stopPairs[stopPairs.length - 1].arrival_stop}</h4>
            <p>{getDestinationTime()}</p>
         </div>
      </div>
   );

   // Display the middle stops when the accordion is clicked
   function handleMiddleStops(stops) {
      return stops.slice(1).map((stop) => {
         return (
            <div className={PlannerCSS.middle_stops_data} key={stop.departure_stop}>
               <FiberManualRecordRoundedIcon fontSize="inherit" />
               <p>Stop {stop.departure_stop}</p>
            </div>
         );
      });
   }

   // Function to get the predicted time at the end of the trip 
   function getDestinationTime() {
      const sum = searchResults.total_predictions.reduce((a, b) => a + b, 0);
      const avg = (sum / searchResults.total_predictions.length) || 0;

      return moment(selectedHour).add(avg, 's').format('HH:mm');
   }
};

export default ExpandedResults;