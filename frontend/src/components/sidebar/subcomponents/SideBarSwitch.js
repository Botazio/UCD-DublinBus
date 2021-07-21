import { ReactComponent as IconList } from "../fixtures/icon-list.svg";
import SideBarCSS from "../Sidebar.module.css";

// This component renders an icon list that opens and closes the sidebar
const SideBarSwitch = ({ sideBar, setSideBar }) => {
  return (
    <div className={SideBarCSS.list_icon + " " +
      (sideBar ? SideBarCSS.list_icon_active : SideBarCSS.list_icon_inactive)}
      onClick={() => setSideBar(!sideBar)}
    >
      <IconList height={"25"} />
    </div>
  );
};

export default SideBarSwitch;
