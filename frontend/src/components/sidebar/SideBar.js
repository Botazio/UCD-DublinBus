import ReactDOM from "react-dom";
import SidebarCSS from "./Sidebar.module.css";
import InfoBar from "../infobar/InfoBar";
import { useState } from "react";
import SideBarSwitch from "./subcomponents/SideBarSwitch";
import DirectionsRoundedIcon from '@material-ui/icons/DirectionsRounded';
import TimelineRoundedIcon from '@material-ui/icons/TimelineRounded';
import MyLocationRoundedIcon from '@material-ui/icons/MyLocationRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import CloudRoundedIcon from '@material-ui/icons/CloudRounded';
import DepartureBoardRoundedIcon from '@material-ui/icons/DepartureBoardRounded';
import { useTheme } from "@material-ui/core";
import SectionButton from "../../reusable-components/section-button/SectionButton";

// Main component of the bus page. Handles which section is active
// Passes that state to the infobar
const SideBar = () => {
  // States to control when to display the sideBar and the infoBar
  const [sideBar, setSideBar] = useState(true);
  const [infoBar, setInfoBar] = useState(false);

  // buttonActive allows to navigate around the different side bar features
  const [buttonActive, setButtonActive] = useState("");

  // Grab the theme from the provider 
  const theme = useTheme().theme;

  // Center the view in Dublin after changing sections 

  // We need to create a portal for the list icon that control the visibility of the sidebar.
  // This is because the list icon is in the navbar
  const domNodeList = document.getElementById("icon");

  // For phone we display the section the user is on instead of the application logo
  const domNodeLogo = document.getElementById("logo_navbar_phone");


  return (
    <>
      {/* Portal that sends the list icon to the navbar */}
      {ReactDOM.createPortal(
        <SideBarSwitch sideBar={sideBar} setSideBar={setSideBar} />,
        domNodeList
      )}

      {/* Renders the active button if there is one, renders 'DUBLIN BUS' in case there is none.
         Only for phone. The visibility is control in the css styles for the navbar. */}
      {ReactDOM.createPortal(
        buttonActive ? buttonActive : "DUBLIN BUS",
        domNodeLogo
      )}

      {/* The classname depends on the sidebar state */}
      <div className={SidebarCSS.sidebar + " " + (sideBar ? SidebarCSS.sidebar_active : SidebarCSS.sidebar_inactive)}>
        {/* Render the section buttons */}
        <SectionButton onClick={() => handleClick("directions")} text={"directions"} buttonActive={buttonActive} icon={<DirectionsRoundedIcon htmlColor={theme.icon_color} />} />
        <SectionButton onClick={() => handleClick("stops")} text={"stops"} buttonActive={buttonActive} icon={<DepartureBoardRoundedIcon htmlColor={theme.icon_color} />} />
        <SectionButton onClick={() => handleClick("lines")} text={"lines"} buttonActive={buttonActive} icon={<TimelineRoundedIcon htmlColor={theme.icon_color} />} />
        <SectionButton onClick={() => handleClick("near me")} text={"near me"} buttonActive={buttonActive} icon={<MyLocationRoundedIcon htmlColor={theme.icon_color} />} />
        <SectionButton onClick={() => handleClick("favorites")} text={"favorites"} buttonActive={buttonActive} icon={<FavoriteRoundedIcon htmlColor={theme.icon_color} />} />
        <SectionButton onClick={() => handleClick("weather")} text={"weather"} buttonActive={buttonActive} icon={<CloudRoundedIcon htmlColor={theme.icon_color} />} />
      </div>

      {/* Render the infobar if it is active */}
      {infoBar && <InfoBar
        sideBar={sideBar}
        setInfoBar={setInfoBar}
        buttonActive={buttonActive}
        setButtonActive={setButtonActive}
      />}
    </>
  );

  // Function triggered when one of the buttons is clicked
  // Changes the button active and opens the infobar 
  function handleClick(value) {
    setInfoBar(true);
    setButtonActive(value);

    // Close the side bar on click for phone view
    if (window.innerWidth < 600) {
      setSideBar(false);
    }
  }
};

export default SideBar;
