import SideBarCSS from "../Sidebar.module.css";
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';

// This component renders an icon list that opens and closes the sidebar
const SideBarSwitch = ({ sideBar, setSideBar }) => {
  return (
    <div className={SideBarCSS.list_icon + " " +
      (sideBar ? SideBarCSS.list_icon_active : SideBarCSS.list_icon_inactive)}
      onClick={() => setSideBar(!sideBar)}
    >
      <MenuRoundedIcon fontSize="large" />
    </div>
  );
};

export default SideBarSwitch;
