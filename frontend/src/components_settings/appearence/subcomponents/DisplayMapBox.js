import lightMap from "../fixtures/light-theme.png";
import darkMap from "../fixtures/dark-theme.png";
import greyMap from "../fixtures/grey-theme.png";
import AppearenceCSS from "../Appearence.module.css";

// This component changes the map theme for the small box 
// that is used as example 
const DisplayMapBox = ({ boxTheme }) => {
   return (
      <div className={AppearenceCSS.display_theme_map}>
         {boxTheme.map === "defaultThemeLight" && <img alt="Map theme light" src={lightMap}></img>}
         {boxTheme.map === "defaultThemeDark" && <img alt="Map theme dark" src={darkMap}></img>}
         {boxTheme.map === "defaultThemeGrey" && <img alt="Map theme grey" src={greyMap}></img>}
      </div>
   );
};

export default DisplayMapBox;