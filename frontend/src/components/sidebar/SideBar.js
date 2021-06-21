import SidebarCSS from './Sidebar.module.css';
import { ReactComponent as List } from './fixtures/icon-list.svg';
import InfoBar from "./infobar/InfoBar";
import { useState } from 'react';

const SideBar = () => {
   const [sidebar, setSideBar] = useState(false);

   return (
      <>
         <div
            className={SidebarCSS.list_icon + " " + (sidebar ? SidebarCSS.list_icon_inactive : SidebarCSS.list_icon_active)}
            onClick={() => setSideBar(!sidebar)}>
            <List height={'25'} />
         </div>
         <div className={SidebarCSS.container}>
            <div className={SidebarCSS.sidebar + " " + (sidebar ? SidebarCSS.sidebar_inactive : SidebarCSS.sidebar_active)}>
               <div className={SidebarCSS.button}>
                  <p>Directions</p>
                  <p>&#10095;</p>
               </div>
               <div className={SidebarCSS.button}>
                  <p>Stops</p>
                  <p>&#10095;</p>
               </div>
               <div className={SidebarCSS.button}>
                  <p>Lines</p>
                  <p>&#10095;</p>
               </div>
               <div className={SidebarCSS.button}>
                  <p>Near me</p>
                  <p>&#10095;</p>
               </div>
               <div className={SidebarCSS.button}>
                  <p>Favorites</p>
                  <p>&#10095;</p>
               </div>
            </div>
            <InfoBar sidebar={sidebar} />
         </div>
      </>
   );
}

export default SideBar;