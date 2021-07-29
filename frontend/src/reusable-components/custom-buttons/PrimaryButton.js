import { Button, makeStyles, useTheme } from "@material-ui/core";

// Custom styles for the button
const useStyles = makeStyles((theme) => ({
   root: {
      border: "1px solid" + theme.theme.primary,
      color: theme.theme.primary
   },
}));

// This component takes the styles from the theme provider and 
// displays a material ui button that uses the primary color
const PrimaryButton = ({ children, ...restProps }) => {

   // Calls the current theme and uses it to create the styles for the button
   const currentTheme = useTheme();
   const classes = useStyles(currentTheme);

   return (
      <Button classes={{ root: classes.root }} {...restProps}>
         {children}
      </Button>
   );
};

export default PrimaryButton;