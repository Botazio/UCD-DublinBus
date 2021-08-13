import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import SettingsBarCSS from "../SettingsBar.module.css";

// This component renders an icon list that opens and closes the sidebar
const SideBarSwitch = ({ sideBar, setSideBar }) => {
  return (
    <div className={SettingsBarCSS.icon + " " +
      (sideBar ? SettingsBarCSS.icon_active : SettingsBarCSS.icon_inactive)}
      onClick={() => setSideBar(!sideBar)}
    >
      <SettingsRoundedIcon fontSize="large" />
    </div>
  );
};

export default SideBarSwitch;
