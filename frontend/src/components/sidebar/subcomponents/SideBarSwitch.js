import SideBarCSS from "../Sidebar.module.css";
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import { useTheme } from "@material-ui/core";

// This component renders an icon list that opens and closes the sidebar
const SideBarSwitch = ({ sideBar, setSideBar }) => {

  // Grab the theme from the provider
  const theme = useTheme().theme;

  return (
    <div className={SideBarCSS.list_icon}
      onClick={() => setSideBar(!sideBar)}
    >
      <MenuRoundedIcon fontSize="large" htmlColor={sideBar ? theme.primary : theme.icon_color} />
    </div>
  );
};

export default SideBarSwitch;
