import AppearenceCSS from "../Appearence.module.css";
import { createTheme, useTheme } from '@material-ui/core/styles';

// Predefined themes 
const defaultThemeLight = (mapTheme) => createTheme({
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
   map: mapTheme,
});

const defaultThemeDark = (mapTheme) => createTheme({
   theme: {
      primary: "#239C7D",
      divider: "#FFFFFF",
      background_primary: "#010409",
      background_secondary: "#282931",
      icon_color: "#FFFFFF",
      font_color: "#FFFFFF",
   },
   palette: {
      primary: {
         main: "#239C7D"
      }
   },
   map: mapTheme,
});

const defaultThemeDarkGray = (mapTheme) => createTheme({
   theme: {
      primary: "#7F7DA2",
      divider: "#BFFCFC",
      background_primary: "#2F4F4F",
      background_secondary: "#3A616E",
      icon_color: "#BFFCFC",
      font_color: "#FFFFFF"
   },
   palette: {
      primary: {
         main: "#7F7DA2"
      }
   },
   map: mapTheme,
});

// This component renders bottom that allows the user to change UI 
// to the themes defined above. Firstly, it changes the ThemeBox then
// the user needs to save the changes
const PreThemesButtons = ({ setBoxTheme }) => {
   // Grab the map theme from the provider
   const mapTheme = useTheme().map;

   return (
      <div className={AppearenceCSS.pre_themes_wrapper}>
         <div className={AppearenceCSS.pre_themes_button} onClick={() => setBoxTheme(defaultThemeLight(mapTheme))}>
            <div id={AppearenceCSS.pre_themes_button1}></div>
         </div>
         <div className={AppearenceCSS.pre_themes_button} onClick={() => setBoxTheme(defaultThemeDark(mapTheme))}>
            <div id={AppearenceCSS.pre_themes_button2}></div>
         </div>
         <div className={AppearenceCSS.pre_themes_button} onClick={() => setBoxTheme(defaultThemeDarkGray(mapTheme))}>
            <div id={AppearenceCSS.pre_themes_button3}></div>
         </div>
      </div>
   );
};

export default PreThemesButtons;