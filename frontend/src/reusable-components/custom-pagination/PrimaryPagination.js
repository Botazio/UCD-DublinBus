import Pagination from "@material-ui/lab/Pagination";
import { makeStyles, useTheme } from "@material-ui/core";

// Custom styles for the button
const useStyles = makeStyles((theme) => ({
   root: {
      "& .Mui-selected": {
         backgroundColor: theme.theme.primary + " !important",
         color: theme.theme.background_primary + " !important",
      },
      "& .MuiPagination-ul": {
         flexWrap: "nowrap"
      }
   },
}));

// This component takes the styles from the theme provider and 
// displays a material ui pagination that uses the primary color
const PrimaryPagination = ({ children, ...restProps }) => {

   // Calls the current theme and uses it to create the styles for the pagination
   const currentTheme = useTheme();
   const classes = useStyles(currentTheme);

   return (
      <Pagination classes={{ root: classes.root }} {...restProps}>
         {children}
      </Pagination>
   );
};

export default PrimaryPagination;