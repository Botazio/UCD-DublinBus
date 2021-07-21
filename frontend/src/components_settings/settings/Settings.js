import SettingsBar from "../settings-bar/SettingsBar";
import SettingsCSS from "./Settings.module.css";

// This is the main component for the settings page 
const Settings = () => {
   return (
      <div className={SettingsCSS.container}>
         <div className={SettingsCSS.settings_box}>
            <SettingsBar />
         </div>
      </div>
   );
};

export default Settings;