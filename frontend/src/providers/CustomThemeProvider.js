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
      icons: "#000000",
      fontColor: "#000000"
   },
   map: "defaultThemeLight"
});

const CustomThemeProvider = (props) => {
   const [theme, setTheme] = useState(defaultTheme);
   const { currentUser } = useAuth();

   // If there is a user set up the theme to the user preferences
   useEffect(() => {
      // This will change in the moment the backend provides users with default theme
      if (currentUser && currentUser.theme) {
         setTheme(currentUser.theme);
      }
      if (currentUser && currentUser.map) {
         setTheme({ ...defaultTheme, map: currentUser.map });
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