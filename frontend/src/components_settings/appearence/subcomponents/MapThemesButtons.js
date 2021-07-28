import AppearenceCSS from "../Appearence.module.css";

// Different themes for the map
const defaultThemeLight = {
   map: "defaultThemeLight",
};

const defaultThemeDark = {
   map: "defaultThemeDark",
};

const defaultThemeGrey = {
   map: "defaultThemeGrey",
};

// Buttons to change the map theme in the map box 
const MapThemesButtons = ({ boxTheme, setBoxTheme }) => {
   return (
      <div className={AppearenceCSS.map_themes_wrapper}>
         <div className={AppearenceCSS.map_themes_button} onClick={() => setBoxTheme({ ...boxTheme, ...defaultThemeLight })}>
            <div id={AppearenceCSS.map_themes_button1}></div>
         </div>
         <div className={AppearenceCSS.map_themes_button} onClick={() => setBoxTheme({ ...boxTheme, ...defaultThemeDark })}>
            <div id={AppearenceCSS.map_themes_button2}></div>
         </div>
         <div className={AppearenceCSS.map_themes_button} onClick={() => setBoxTheme({ ...boxTheme, ...defaultThemeGrey })}>
            <div id={AppearenceCSS.map_themes_button3}></div>
         </div>
      </div>
   );
};

export default MapThemesButtons;