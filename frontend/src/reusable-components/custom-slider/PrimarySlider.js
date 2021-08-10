import { makeStyles, Slider, useTheme } from "@material-ui/core";

// Custom styles for the button
const useStyles = makeStyles((theme) => ({
   root: {
      color: theme.theme.primary + " !important",
   },
}));

// This component takes the styles from the theme provider and 
// displays a material ui slider that uses the primary color
const PrimarySlider = ({ children, ...restProps }) => {

   // Calls the current theme and uses it to create the styles for the slider
   const currentTheme = useTheme();
   const classes = useStyles(currentTheme);

   return (
      <Slider classes={{ root: classes.root }} {...restProps}>
         {children}
      </Slider>
   );
};

export default PrimarySlider;