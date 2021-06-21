import SidebarCSS from '../Sidebar.module.css';

const InfoBar = ({ sidebar }) => {
   return (
      <div className={SidebarCSS.infobar + " " + (sidebar ? SidebarCSS.infobar_sidebar_inactive : SidebarCSS.infobar_sidebar_active)}>
      </div>
   );
}

export default InfoBar;