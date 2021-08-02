import { makeStyles, useTheme } from "@material-ui/core";
import {
   MuiPickersUtilsProvider,
   DatePicker,
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

const PrimaryDatePicker = ({ selectedDate, setSelectedDate }) => {

   // Calls the current theme and uses it to create the styles for the button
   const currentTheme = useTheme();
   const classes = useStyles(currentTheme);

   const handleDateChange = (date) => {
      setSelectedDate(date);
   };

   return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
         <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            animateYearScrolling
         />
      </MuiPickersUtilsProvider>
   );
};

export default PrimaryDatePicker;