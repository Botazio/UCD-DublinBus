import { useAuth } from "./AuthContext";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { useEffect } from "react";
import { useState } from "react";

const defaultTheme = createTheme({
   theme: {
      primary: "#0094EC",
      divider: "#D3D3D3",
      background_primary: "#FFFFFF",
      background_secondary: "#fafafa",
      icon_color: "#000000",
      font_color: "#000000",
      font_size: "1rem"
   },
   palette: {
      primary: {
         main: "#0094EC"
      }
   },
   map: "defaultThemeLight",
});

const customTheme = (theme, mapTheme) => createTheme({
   theme: theme,
   palette: {
      primary: {
         main: theme.primary
      }
   },
   map: mapTheme,
});

const CustomThemeProvider = (props) => {
   const [theme, setTheme] = useState(defaultTheme);
   const { currentUser } = useAuth();

   // If there is a user set up the theme to the user preferences
   useEffect(() => {
      // If there is a user use the user theme
      if (currentUser) {
         setTheme(customTheme(currentUser.theme, currentUser.map));
      }
      else {
         setTheme(defaultTheme);
      }
      // eslint-disable-next-line
   }, [currentUser]);

   return (
      <ThemeProvider theme={theme}>
         {props.children}
      </ThemeProvider>);
};

export default CustomThemeProvider;