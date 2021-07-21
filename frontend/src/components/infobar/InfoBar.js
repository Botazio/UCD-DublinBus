import InfobarCSS from "./Infobar.module.css";
import { ReactComponent as Close } from "../../fixtures/icons/icon-close.svg";
import Directions from "../directions/Directions";
import Stops from "../stops/Stops";
import NearMe from "../near-me/NearMe";
import MapSwitch from "../map-switch/MapSwitch";
import WeatherInfo from "../weather-info/WeatherInfo";

// InfoBar is a subcomponent of SideBar
// Renders section component depending which one is active 
// All the states are coming from the sidebar
const InfoBar = ({
  sideBar,
  setInfoBar,
  buttonActive,
  setButtonActive,
}) => {

  return (
    <>
      <div className={InfobarCSS.map_switcher}>
        {/* We want to rerender the component every time buttonActive changes */}
        <MapSwitch buttonActive={buttonActive} />
      </div>

      {/* The styles for the infobar depends on the sidebar position */}
      <div className={InfobarCSS.infobar + " " + (sideBar ? InfobarCSS.infobar_sidebar_active : InfobarCSS.infobar_sidebar_inactive)}>

        {/* Icon to close the infobar */}
        <div className={InfobarCSS.close_button} onClick={() => handleClose()}>
          <Close height={"15"} />
        </div>

        {/* This empty div sets up an space between the map switch and the rest of the components */}
        <div className={InfobarCSS.dummy_div}></div>

        {/* Render a section depending on which one is active */}
        {buttonActive === "directions" && <Directions />}
        {buttonActive === "stops" && <Stops />}
        {buttonActive === "near me" && <NearMe />}
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
