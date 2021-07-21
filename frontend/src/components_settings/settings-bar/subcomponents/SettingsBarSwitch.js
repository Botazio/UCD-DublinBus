import { ReactComponent as IconSettings } from "../fixtures/icon-settings.svg";
import SettingsBarCSS from "../SettingsBar.module.css";

// This component renders an icon list that opens and closes the sidebar
const SideBarSwitch = ({ sideBar, setSideBar }) => {
  return (
    <div className={SettingsBarCSS.icon + " " +
      (sideBar ? SettingsBarCSS.icon_active : SettingsBarCSS.icon_inactive)}
      onClick={() => setSideBar(!sideBar)}
    >
      <IconSettings width={'28'} height={"28"} />
    </div>
  );
};

export default SideBarSwitch;
