import defaultMap from "../fixtures/map_default.png";
import AppearenceCSS from "../Appearence.module.css";

const DisplayMapBox = ({ boxTheme }) => {
   return (
      <div className={AppearenceCSS.display_theme_map}>
         {boxTheme.map === "defaultThemeLight" && <img alt="Map theme" src={defaultMap}></img>}
      </div>
   );
};

export default DisplayMapBox;