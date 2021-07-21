import ReactDOM from "react-dom";
import SidebarCSS from "./Sidebar.module.css";
import InfoBar from "../infobar/InfoBar";
import { useState } from "react";
import SideBarSwitch from "./subcomponents/SideBarSwitch";

// Main component of the bus page. Handles which section is active
// Passes that state to the infobar
const SideBar = () => {
  // States to control when to display the sideBar and the infoBar
  const [sideBar, setSideBar] = useState(true);
  const [infoBar, setInfoBar] = useState(false);

  // buttonActive allows to navigate around the different side bar features
  const [buttonActive, setButtonActive] = useState("");

  // We need to create a portal for the list icon that control the visibility of the sidebar.
  // This is because the list icon is in the navbar
  const domNodeList = document.getElementById("icon");

  // For phone we display the section the user is on instead of the application logo
  const domNodeLogo = document.getElementById("logo_navbar_phone");

  // Buttons displayed on the sidebar 
  const sectionButton = (text) => {
    return (
      <div className={SidebarCSS.button + " " + (buttonActive === text ? SidebarCSS.active : "")}
        value={text}
        onClick={() => handleClick(text)}
      >
        <p>{text}</p>
        <p>&#10095;</p>
      </div>
    );
  };

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
        {sectionButton("directions")}
        {sectionButton("stops")}
        {sectionButton("lines")}
        {sectionButton("near me")}
        {sectionButton("favorites")}
        {sectionButton("weather")}
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
