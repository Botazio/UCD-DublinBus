import Card from "../../../reusable-components/card/Card";
import BarChartRoundedIcon from '@material-ui/icons/BarChartRounded';
import MinimizeRoundedIcon from '@material-ui/icons/MinimizeRounded';
import PlannerCSS from "../Planner.module.css";
import { useTheme } from "@material-ui/core";
import { useState } from "react";
import ExpandedResults from "./ExpandedResults";
import DialogWrapper from "../../../reusable-components/dialog-feedback/DialogWrapper";
import FeedbackDefault from "../../../reusable-components/dialog-feedback/FeedbackDefault";
import QuantileGraph from "./QuantileGraph";

// This component displays the results after the server
// sends back the response
const DisplayResults = ({ searchResults, selectedHour, origin, destination }) => {
   // State to control when the user clicks on the results
   const [expanded, setExpanded] = useState(false);
   // State to control the popup when the graph icon is clicked
   const [open, setOpen] = useState(false);

   // Grab the theme from the provider
   const theme = useTheme().theme;

   // Funtions to control how to open and close the popup
   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   return (
      <Card variant="margin_bottom" >
         {/* Display the prediction time */}
         {searchResults && getPredictedTime(searchResults.total_predictions)}

         {/* Display a dialog asking for user feedback after getting the results */}
         {searchResults && <DialogWrapper time="10000">
            <FeedbackDefault title="Was this information helpful?" />
         </DialogWrapper>}


         {/* Display the expanded results */}
         {searchResults && expanded && <ExpandedResults searchResults={searchResults} selectedHour={selectedHour} />}

         {/* Display the popup for the quantile dots plot graph */}
         {open && <QuantileGraph open={open} handleClose={handleClose} origin={origin} destination={destination} />}
      </Card>
   );

   // Get the predicted time
   function getPredictedTime(times) {
      const q20 = handleUnits(getQuantile(times, 0.2));
      const q80 = handleUnits(getQuantile(times, 0.8));

      let resultTime;
      if (q20 === q80) {
         resultTime = q20;
      } else {
         resultTime = q20 + " - " + q80;
      }

      return (
         <div className={PlannerCSS.header_results} style={{ padding: "5px 0px" }}>
            <div onClick={() => setExpanded(!expanded)}>
               <h4 style={{ color: theme.primary }}>{resultTime}</h4>
               <div
                  className={PlannerCSS.expand_results_icon}>
                  <MinimizeRoundedIcon fontSize="large" />
               </div>
            </div>
            <BarChartRoundedIcon onClick={handleClickOpen} />
         </div>);
   }

   // Get the quantiles
   function getQuantile(arr, q) {
      const sorted = asc(arr);
      const pos = (sorted.length - 1) * q;
      const base = Math.floor(pos);
      const rest = pos - base;
      if (sorted[base + 1] !== undefined) {
         return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
      } else {
         return sorted[base];
      }
   };

   // Sort array ascending
   function asc(arr) {
      return arr.sort((a, b) => a - b);
   }

   // Handle the units
   function handleUnits(d) {
      var h = Math.floor(d / 3600);
      var m = Math.floor(d % 3600 / 60);
      var s = Math.floor(d % 3600 % 60);

      var hDisplay = h > 0 ? h + "h " : "";
      var mDisplay = m > 0 ? m + "m " : "";
      var sDisplay = s > 0 ? s + "s " : "";
      return hDisplay + mDisplay + sDisplay;
   }
};

export default DisplayResults;