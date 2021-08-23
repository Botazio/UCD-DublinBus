import InfobarCSS from "./Infobar.module.css";
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import Stops from "../stops/Stops";
import NearMe from "../near-me/NearMe";
import MapSwitch from "../map-switch/MapSwitch";
import WeatherInfo from "../weather-info/WeatherInfo";
import Favorites from "../favorites/Favorites";
import Lines from "../lines/Lines";
import { useTheme } from "@material-ui/core";
import Planner from "../planner/Planner";

// InfoBar is a subcomponent of SideBar
// Renders section component depending which one is active 
// All the states are coming from the sidebar
const InfoBar = ({
  sideBar,
  setInfoBar,
  buttonActive,
  setButtonActive,
}) => {

  // Grab the theme from the provider
  const theme = useTheme().theme;

  return (
    <>
      <div className={InfobarCSS.map_switcher}>
        {/* We want to rerender the component every time buttonActive changes */}
        <MapSwitch buttonActive={buttonActive} />
      </div>

      {/* The styles for the infobar depends on the sidebar position */}
      <div
        className={InfobarCSS.infobar + " " + (sideBar ? InfobarCSS.infobar_sidebar_active : InfobarCSS.infobar_sidebar_inactive)}
        style={{ backgroundColor: theme.background_secondary }}>

        {/* Icon to close the infobar */}
        <div className={InfobarCSS.close_button} onClick={() => handleClose()}>
          <CloseRoundedIcon fontSize="inherit" />
        </div>

        {/* This empty div sets up an space between the map switch and the rest of the components */}
        <div className={InfobarCSS.dummy_div}></div>

        {/* Render a section depending on which one is active */}
        {buttonActive === "planner" && <Planner />}
        {buttonActive === "stops" && <Stops />}
        {buttonActive === "lines" && <Lines />}
        {buttonActive === "near me" && <NearMe />}
        {buttonActive === "favorites" && <Favorites />}
        {buttonActive === "weather" && <WeatherInfo />}
      </div>
    </>
  );

  // Function that closes the infobar and sets the active button to null
  function handleClose() {
    setInfoBar(false);
    setButtonActive("");
  }
};

export default InfoBar;
