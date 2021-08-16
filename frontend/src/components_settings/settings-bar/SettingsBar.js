import ReactDOM from "react-dom";
import { useState } from "react";
import SettingsBarCSS from "./SettingsBar.module.css";
import SettingsBarSwitch from "./subcomponents/SettingsBarSwitch";
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import PaletteRoundedIcon from '@material-ui/icons/PaletteRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import RoomRoundedIcon from '@material-ui/icons/RoomRounded';
import FeedbackRoundedIcon from '@material-ui/icons/FeedbackRounded';
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
            {sectionButton("profile", <PersonRoundedIcon />)}
            {sectionButton("appearence", <PaletteRoundedIcon />)}
            {sectionButton("favorites", <FavoriteRoundedIcon />)}
            {sectionButton("markers", <RoomRoundedIcon />)}
            {sectionButton("feedback", <FeedbackRoundedIcon />)}
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