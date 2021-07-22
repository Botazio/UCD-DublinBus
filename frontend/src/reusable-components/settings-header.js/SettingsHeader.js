import SettingsHeaderCSS from "./SettingsHeader.module.css";

// This component defines the header for the different sections in the settings page
const SettingsHeader = ({ title, body, headerColor }) => {
   return (
      <div className={SettingsHeaderCSS.header_wrapper}>
         <div className={SettingsHeaderCSS.header_title} style={{ color: headerColor }}>
            <h2>{title}</h2>
         </div>
         <div className={SettingsHeaderCSS.header_info}>
            <p>{body}</p>
         </div>
      </div>
   );
};

export default SettingsHeader;