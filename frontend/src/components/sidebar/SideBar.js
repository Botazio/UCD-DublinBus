import ReactDOM from "react-dom";
import SidebarCSS from "./Sidebar.module.css";
import InfoBar from "../infobar/InfoBar";
import { useState } from "react";
import SideBarSwitch from "../sidebar-switch/SideBarSwitch";

const SideBar = () => {
  // States to control when to display the sideBar and the infoBar
  const [sideBar, setSideBar] = useState(true);
  const [infoBar, setInfoBar] = useState(false);

  // buttonActive allows to navigate around the different side bar features
  const [buttonActive, setButtonActive] = useState("");

  // We need to create a portal for the list icon that control the visibility of the sidebar.
  // This is because the list icon is in the navbar
  const domNodeList = document.getElementById("list_icon");

  // For phone we display the section the user is on instead of the application logo
  const domNodeLogo = document.getElementById("logo_navbar_phone");

  return (
    <>
      {ReactDOM.createPortal(
        <SideBarSwitch sideBar={sideBar} setSideBar={setSideBar} />,
        domNodeList
      )}
      {/* Renders the active button if there is one, renders 'DUBLIN BUS' in case there is none.
         Only for phone. It is control in the css styles for the navbar. */}
      {ReactDOM.createPortal(
        buttonActive ? buttonActive : "DUBLIN BUS",
        domNodeLogo
      )}

      <div
        className={
          SidebarCSS.sidebar +
          " " +
          (sideBar ? SidebarCSS.sidebar_active : SidebarCSS.sidebar_inactive)
        }
      >
        <div
          className={
            SidebarCSS.button +
            " " +
            (buttonActive === "directions" ? SidebarCSS.active : "")
          }
          value={"directions"}
          onClick={() => handleClick("directions")}
        >
          <p>Directions</p>
          <p>&#10095;</p>
        </div>
        <div
          className={
            SidebarCSS.button +
            " " +
            (buttonActive === "stops" ? SidebarCSS.active : "")
          }
          value={"stops"}
          onClick={() => handleClick("stops")}
        >
          <p>Stops</p>
          <p>&#10095;</p>
        </div>
        <div
          className={
            SidebarCSS.button +
            " " +
            (buttonActive === "lines" ? SidebarCSS.active : "")
          }
          value={"lines"}
          onClick={() => handleClick("lines")}
        >
          <p>Lines</p>
          <p>&#10095;</p>
        </div>
        <div
          className={
            SidebarCSS.button +
            " " +
            (buttonActive === "near me" ? SidebarCSS.active : "")
          }
          value={"near me"}
          onClick={() => handleClick("near me")}
        >
          <p>Near me</p>
          <p>&#10095;</p>
        </div>
        <div
          className={
            SidebarCSS.button +
            " " +
            (buttonActive === "favorites" ? SidebarCSS.active : "")
          }
          value={"favorites"}
          onClick={() => handleClick("favorites")}
        >
          <p>Favorites</p>
          <p>&#10095;</p>
        </div>
        <div
          className={
            SidebarCSS.button +
            " " +
            (buttonActive === "weather" ? SidebarCSS.active : "")
          }
          value={"favorites"}
          onClick={() => handleClick("weather")}
        >
          <p>Weather</p>
          <p>&#10095;</p>
        </div>
      </div>

      <InfoBar
        sideBar={sideBar}
        infoBar={infoBar}
        setInfoBar={setInfoBar}
        buttonActive={buttonActive}
        setButtonActive={setButtonActive}
      />
    </>
  );

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
