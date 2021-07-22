import { createTheme } from "@material-ui/core";
import AppearenceCSS from "../Appearence.module.css";

const defaultThemeLight = createTheme({
   map: "defaultThemeLight",
});

const defaultThemeDark = createTheme({
   map: "defaultThemeDark",
});

const defaultThemeDarkGray = createTheme({
   map: "defaultThemeDarkGray",
});

const MapThemesButtons = ({ setBoxTheme }) => {
   return (
      <div className={AppearenceCSS.map_themes_wrapper}>
         <div className={AppearenceCSS.map_themes_button} onClick={() => setBoxTheme(defaultThemeLight)}>
            <div id={AppearenceCSS.map_themes_button1}></div>
         </div>
         <div className={AppearenceCSS.map_themes_button} onClick={() => setBoxTheme(defaultThemeDark)}>
            <div id={AppearenceCSS.map_themes_button2}></div>
         </div>
         <div className={AppearenceCSS.map_themes_button} onClick={() => setBoxTheme(defaultThemeDarkGray)}>
            <div id={AppearenceCSS.map_themes_button3}></div>
         </div>
      </div>
   );
};

export default MapThemesButtons;