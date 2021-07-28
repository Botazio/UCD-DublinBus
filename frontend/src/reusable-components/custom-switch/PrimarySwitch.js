import { Switch, makeStyles, useTheme } from "@material-ui/core";


// Custom styles for the switch
const useStyles = makeStyles((theme) => ({
   switch_track: {
      backgroundColor: theme.theme.divider,
   },
   switch_base: {
      color: theme.theme.divider,
      "&.Mui-checked": {
         color: theme.theme.primary
      },
      "&.Mui-checked + .MuiSwitch-track": {
         backgroundColor: theme.theme.primary + 70,
      }
   },
}));

// This component takes the styles from the theme provider and 
// displays a material ui switch that uses the primary color
const PrimarySwitch = ({ children, ...restProps }) => {

   // Calls the current theme and uses it to create the styles for the pagination
   const currentTheme = useTheme();
   const classes = useStyles(currentTheme);

   return (
      <Switch
         classes={{
            track: classes.switch_track,
            switchBase: classes.switch_base
         }}
         {...restProps}>
         {children}
      </Switch>
   );
};

export default PrimarySwitch;