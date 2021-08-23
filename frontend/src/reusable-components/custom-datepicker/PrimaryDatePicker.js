import { ThemeProvider, useTheme } from "@material-ui/core";
import {
   MuiPickersUtilsProvider,
   DatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment from "moment";


const materialTheme = (theme) => ({
   overrides: {
      MuiPickersToolbar: {
         toolbar: {
            backgroundColor: theme.primary,
         },
      },
      MuiPickersToolbarText: {
         toolbarBtnSelected: {
            color: theme.background_primary,
         },
         toolbarTxt: {
            color: theme.background_primary,
         }
      },
      MuiPickersCalendarHeader: {
         switchHeader: {
            color: theme.font_color,
         },
         dayLabel: {
            color: theme.font_color + 90,
         },
         iconButton: {
            backgroundColor: theme.background_primary
         }
      },
      MuiPickersDay: {
         day: {
            color: theme.primary,
         },
         daySelected: {
            backgroundColor: theme.primary + "!important",
         },
         dayDisabled: {
            color: theme.primary + 60,
         },
         current: {
            color: theme.primary,
         },
      },
      MuiPickersModal: {
         dialogRoot: {
            backgroundColor: theme.background_primary,
         }
      },
      MuiButton: {
         textPrimary: {
            color: theme.font_color,
         }
      },
      MuiInput: {
         input: {
            borderBottom: "1px solid " + theme.divider,
            color: theme.font_color
         }
      }
   },
});

const PrimaryDatePicker = ({ selectedDate, setSelectedDate }) => {

   const theme = useTheme().theme;
   const styles = materialTheme(theme);

   const handleDateChange = (date) => {
      setSelectedDate(date);
   };

   return (
      <ThemeProvider theme={styles}>
         <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
               maxDate={moment().add(6, 'days')}
               disablePast={true}
               value={selectedDate}
               onChange={handleDateChange}
               animateYearScrolling
            />
         </MuiPickersUtilsProvider>
      </ThemeProvider>
   );
};

export default PrimaryDatePicker;