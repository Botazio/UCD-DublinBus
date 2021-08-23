import { ThemeProvider, useTheme } from "@material-ui/core";
import {
   MuiPickersUtilsProvider,
   TimePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

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
            color: theme.background_primary + 80,
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
      MuiPickersClockNumber: {
         clockNumber: {
            color: theme.font_color
         }
      },
      MuiPickersClock: {
         clock: {
            backgroundColor: theme.background_secondary
         },
         pin: {
            backgroundColor: theme.primary
         }
      },
      MuiPickersClockPointer: {
         pointer: {
            backgroundColor: theme.primary
         },
         noPoint: {
            backgroundColor: theme.primary
         },
         thumb: {
            backgroundColor: theme.primary,
            border: "14px solid " + theme.primary,
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

const PrimaryHourPicker = ({ selectedHour, setSelectedHour }) => {

   // Calls the current theme and uses it to create the styles for the button
   const theme = useTheme().theme;
   const styles = materialTheme(theme);


   const handleHourChange = (hour) => {
      setSelectedHour(hour);
   };

   return (
      <ThemeProvider theme={styles}>
         <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <TimePicker
               autoOk
               value={selectedHour}
               onChange={handleHourChange} />
         </MuiPickersUtilsProvider>
      </ThemeProvider>
   );
};

export default PrimaryHourPicker;