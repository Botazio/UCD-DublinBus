import { useTheme } from "@material-ui/core";
import SettingsBar from "../settings-bar/SettingsBar";
import SettingsCSS from "./Settings.module.css";

// This is the main component for the settings page 
const Settings = () => {
   // Grab the theme from the provider
   const theme = useTheme().theme;

   return (
      <div className={SettingsCSS.container} style={{ backgroundColor: theme.background_primary, color: theme.font_color }}>
         <div className={SettingsCSS.settings_box}>
            <SettingsBar />
         </div>
      </div>
   );
};

export default Settings;