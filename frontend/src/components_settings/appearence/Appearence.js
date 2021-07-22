import ThemeBox from "./subcomponents/ThemeBox";
import AppearenceCSS from "./Appearence.module.css";
import SettingsHeader from "../../reusable-components/settings-header.js/SettingsHeader";
import MapTheme from "./subcomponents/MapTheme";

// messages to display in the reusable components
const themeTitle = "Theme preferences";
const themeBody = "Choose how Dublin Bus looks to you. Select one of our themes or create one!";
const preThemeInfo = "Select one of our predefined themes using the buttons down below. See the changes in the box.";
const cusThemeInfo = "Create your custom theme. Use the color pickers to define your own colors.";
const mapPrefTitle = "Map preferences";
const mapPrefBody = "Choose how the map looks!";

// This component is the main component for the appearence section
// in the settings page
const Profile = () => {
   return (
      <>
         <SettingsHeader title={themeTitle} body={themeBody} />

         <div className={AppearenceCSS.theme_wrapper}>
            {/* Predifined themes */}
            <ThemeBox title="Predefined themes" info={preThemeInfo} type="predefined" />
            {/* Custom themes */}
            <ThemeBox title="Custom themes" info={cusThemeInfo} type="custom" />
         </div>
         <SettingsHeader title={mapPrefTitle} body={mapPrefBody} />
         <MapTheme />

      </>
   );
};

export default Profile;