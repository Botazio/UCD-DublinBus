import { useTheme } from '@material-ui/core';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import SettingsBarCSS from "../SettingsBar.module.css";

// This component renders an icon list that opens and closes the sidebar
const SideBarSwitch = ({ sideBar, setSideBar }) => {

  // Grab the theme from the provider
  const theme = useTheme().theme;

  return (
    <div
      className={SettingsBarCSS.icon}
      onClick={() => setSideBar(!sideBar)}
    >
      <SettingsRoundedIcon fontSize="large" htmlColor={(sideBar && (window.innerWidth < 600)) ? theme.primary : theme.icon_color} />
    </div>
  );
};

export default SideBarSwitch;
