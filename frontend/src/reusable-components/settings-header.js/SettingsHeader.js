import { useTheme } from "@material-ui/core";
import SettingsHeaderCSS from "./SettingsHeader.module.css";

// This component defines the header for the different sections in the settings page
const SettingsHeader = ({ title, body, headerColor }) => {

   // Grab the theme from the provider
   const theme = useTheme().theme;

   return (
      <div className={SettingsHeaderCSS.header_wrapper}>
         <div className={SettingsHeaderCSS.header_title} style={{ color: headerColor }}>
            <h2 style={{ borderBottom: `1px solid ${theme.divider}` }}>{title}</h2>
         </div>
         <div className={SettingsHeaderCSS.header_info}>
            <p>{body}</p>
         </div>
      </div>
   );
};

export default SettingsHeader;