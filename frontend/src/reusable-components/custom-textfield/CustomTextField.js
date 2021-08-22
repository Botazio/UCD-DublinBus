import { makeStyles, TextField, useTheme } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
   root: {
      border: `1px solid ${theme.theme.divider}`,
      color: theme.theme.font_color,
      '& .MuiOutlinedInput-notchedOutline': {
         border: "none",
      }
   },
   focused: {
      color: theme.theme.font_color,
      border: `1px solid ${theme.theme.primary}`,
      boxShadow: `0 0 0 0.5pt ${theme.theme.primary}`,
   }
}));

const CustomTextField = (props) => {
   // Grab the theme from the provider
   const theme = useTheme();
   const classes = useStyles(theme);

   return (
      <TextField
         InputProps={{ classes }}
         {...props} />
   );
};

export default CustomTextField;