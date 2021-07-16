import { ReactComponent as List } from "./fixtures/icon-list.svg";
import SideBarSwitchCSS from "./SideBarSwitch.module.css";

const SideBarSwitch = ({ sideBar, setSideBar }) => {
  return (
    <div
      className={
        SideBarSwitchCSS.list_icon +
        " " +
        (sideBar
          ? SideBarSwitchCSS.list_icon_active
          : SideBarSwitchCSS.list_icon_inactive)
      }
      onClick={() => setSideBar(!sideBar)}
    >
      <List height={"25"} />
    </div>
  );
};

export default SideBarSwitch;
