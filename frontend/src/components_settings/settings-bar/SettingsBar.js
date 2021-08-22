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
import SectionButton from "../../reusable-components/section-button/SectionButton";
import { useTheme } from "@material-ui/core";

// Main component of the settings page. Handles which section is active
// Passes that state to the infobox
const SettingsBar = () => {
   // States to control when to display the sideBar
   const [sideBar, setSideBar] = useState(false);
   // buttonActive allows to navigate around the different side bar features
   const [buttonActive, setButtonActive] = useState("profile");

   // Grab the theme from the provider
   const theme = useTheme().theme;

   // We need to create a portal for the settings icon that control the visibility of the sidebar.
   // This is because the settings icon is in the navbar
   const domNodeIcon = document.getElementById("icon");

   // For phone we display the section the user is on instead of the application logo
   const domNodeLogo = document.getElementById("logo_navbar_phone");

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
         <div
            className={SettingsBarCSS.sidebar + " " + (sideBar ? SettingsBarCSS.sidebar_active : SettingsBarCSS.sidebar_inactive)}
            style={{ backgroundColor: theme.background_primary, borderColor: theme.divider }}>

            <div
               className={SettingsBarCSS.sidebar_title}
               style={{ borderBottom: "1px solid " + theme.divider, backgroundColor: theme.background_secondary }}>
               <p>Account Settings</p>
            </div>

            {/* Render the section buttons */}
            <SectionButton onClick={() => handleClick("profile")} text={"profile"} buttonActive={buttonActive} icon={<PersonRoundedIcon />} />
            <SectionButton onClick={() => handleClick("appearance")} text={"appearance"} buttonActive={buttonActive} icon={<PaletteRoundedIcon />} />
            <SectionButton onClick={() => handleClick("favorites")} text={"favorites"} buttonActive={buttonActive} icon={<FavoriteRoundedIcon />} />
            <SectionButton onClick={() => handleClick("markers")} text={"markers"} buttonActive={buttonActive} icon={<RoomRoundedIcon />} />
            <SectionButton onClick={() => handleClick("feedback")} text={"feedback"} buttonActive={buttonActive} icon={<FeedbackRoundedIcon />} />
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