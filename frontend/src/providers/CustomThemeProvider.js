import { useAuth } from "./AuthContext";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { useEffect } from "react";
import { useState } from "react";

const defaultTheme = createTheme({
   user: {
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

   useEffect(() => {
      if (currentUser && currentUser.theme) {
         setTheme(currentUser.theme);
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