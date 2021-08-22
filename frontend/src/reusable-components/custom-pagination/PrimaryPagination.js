import Pagination from "@material-ui/lab/Pagination";
import { makeStyles, useTheme } from "@material-ui/core";

// Custom styles for the button
const useStyles = makeStyles((theme) => ({
   root: {
      "& .Mui-selected": {
         backgroundColor: theme.theme.primary,
         color: theme.theme.background_primary + " !important",
      },
      "& .MuiPagination-ul": {
         flexWrap: "nowrap"
      },
      "& .MuiPaginationItem-root": {
         color: theme.theme.font_color,
      },
   },
}));

// This component takes the styles from the theme provider and 
// displays a material ui pagination that uses the primary color
const PrimaryPagination = ({ children, ...restProps }) => {

   // Calls the current theme and uses it to create the styles for the pagination
   const theme = useTheme();
   const classes = useStyles(theme);


   return (
      <Pagination classes={{ root: classes.root }} {...restProps}>
         {children}
      </Pagination>
   );
};

export default PrimaryPagination;