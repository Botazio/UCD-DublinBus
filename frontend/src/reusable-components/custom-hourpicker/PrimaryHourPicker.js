import { makeStyles, useTheme } from "@material-ui/core";
import {
   MuiPickersUtilsProvider,
   TimePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useState } from "react";

// Custom styles for the button
const useStyles = makeStyles((theme) => ({
   root: {
      border: "1px solid" + theme.theme.primary,
      color: theme.theme.primary
   },
}));

const PrimaryHourPicker = ({ selectedHour, setSelectedHour }) => {

   // Calls the current theme and uses it to create the styles for the button
   const currentTheme = useTheme();
   const classes = useStyles(currentTheme);

   const handleHourChange = (hour) => {
      setSelectedHour(hour);
   };

   return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
         <TimePicker autoOk value={selectedHour} onChange={handleHourChange} />
      </MuiPickersUtilsProvider>
   );
};

export default PrimaryHourPicker;