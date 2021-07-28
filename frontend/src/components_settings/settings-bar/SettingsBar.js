import ReactDOM from "react-dom";
import { useState } from "react";
import SettingsBarCSS from "./SettingsBar.module.css";
import SettingsBarSwitch from "./subcomponents/SettingsBarSwitch";
import { ReactComponent as IconUser } from "./fixtures/icon-user.svg";
import { ReactComponent as IconPalette } from "./fixtures/icon-palette.svg";
import { ReactComponent as IconFav } from "./fixtures/icon-fav.svg";
import { ReactComponent as IconMarker } from "./fixtures/icon-marker.svg";
import InfoBox from "../infobox/InfoBox";

// Main component of the settings page. Handles which section is active
// Passes that state to the infobox
const SettingsBar = () => {
   // States to control when to display the sideBar
   const [sideBar, setSideBar] = useState(false);

   // buttonActive allows to navigate around the different side bar features
   const [buttonActive, setButtonActive] = useState("profile");

   // We need to create a portal for the settings icon that control the visibility of the sidebar.
   // This is because the settings icon is in the navbar
   const domNodeIcon = document.getElementById("icon");

   // For phone we display the section the user is on instead of the application logo
   const domNodeLogo = document.getElementById("logo_navbar_phone");

   // Buttons displayed on the sidebar 
   const sectionButton = (text, icon) => {
      return (
         <div className={SettingsBarCSS.button + " " + (buttonActive === text ? SettingsBarCSS.active : "")}
            value={text}
            onClick={() => handleClick(text)}
         >
            {icon}
            <p>{text}</p>
         </div>
      );
   };

   return (
      <>
         {/* Portal that sends the settings icon to the navbar */}
         {ReactDOM.createPortal(
            <SettingsBarSwitch sideBar={sideBar} setSideBar={setSideBar} />,
            domNodeIcon
         )}

         {/* Renders the active button if there is one, renders 'DUBLIN BUS' in case there is none.
         Only for phone. The visibility is control in the css styles for the navbar. */}
         {ReactDOM.createPortal(
            buttonActive ? buttonActive : "settings",
            domNodeLogo
         )}

         {/* The classname depends on the sidebar state */}
         <div className={SettingsBarCSS.sidebar + " " + (sideBar ? SettingsBarCSS.sidebar_active : SettingsBarCSS.sidebar_inactive)}>
            <div className={SettingsBarCSS.sidebar_title}><p>Account Settings</p></div>
            {/* Render the section buttons */}
            {sectionButton("profile", <IconUser width={20} height={20} />)}
            {sectionButton("appearence", <IconPalette width={20} height={20} />)}
            {sectionButton("favorites", <IconFav width={20} height={20} />)}
            {sectionButton("markers", <IconMarker width={20} height={20} />)}
         </div>


         {/* Render the infobar if it is active */}
         {buttonActive && <InfoBox buttonActive={buttonActive} />}
      </>
   );

   // Function triggered when one of the buttons is clicked
   // Changes the button active and opens the infobar 
   function handleClick(value) {
      setButtonActive(value);
      setSideBar(false);
   }
};

export default SettingsBar;