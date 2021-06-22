import SidebarCSS from './Sidebar.module.css';
import { ReactComponent as List } from './fixtures/icon-list.svg';
import InfoBar from "../infobar/InfoBar";
import { useState } from 'react';

const SideBar = () => {
   const [sideBar, setSideBar] = useState(true);
   const [infoBar, setInfoBar] = useState(false);
   const [buttonActive, setButtonActive] = useState('');

   return (
      <>
         <div
            className={SidebarCSS.list_icon + " " + (sideBar ? SidebarCSS.list_icon_active : SidebarCSS.list_icon_inactive)}
            onClick={() => setSideBar(!sideBar)}>
            <List height={'25'} />
         </div>
         <div className={SidebarCSS.sidebar + " " + (sideBar ? SidebarCSS.sidebar_active : SidebarCSS.sidebar_inactive)}>
            <div
               className={SidebarCSS.button + " " + (buttonActive === 'directions' ? SidebarCSS.active : '')}
               value={'directions'}
               onClick={() => handleClick('directions')}>
               <p>Directions</p>
               <p>&#10095;</p>
            </div>
            <div
               className={SidebarCSS.button + " " + (buttonActive === 'stops' ? SidebarCSS.active : '')}
               value={'stops'}
               onClick={() => handleClick('stops')}>
               <p>Stops</p>
               <p>&#10095;</p>
            </div>
            <div
               className={SidebarCSS.button + " " + (buttonActive === 'lines' ? SidebarCSS.active : '')}
               value={'lines'}
               onClick={() => handleClick('lines')}>
               <p>Lines</p>
               <p>&#10095;</p>
            </div>
            <div
               className={SidebarCSS.button + " " + (buttonActive === 'near me' ? SidebarCSS.active : '')}
               value={'near me'}
               onClick={() => handleClick('near me')}>
               <p>Near me</p>
               <p>&#10095;</p>
            </div>
            <div
               className={SidebarCSS.button + " " + (buttonActive === 'favorites' ? SidebarCSS.active : '')}
               value={'favorites'}
               onClick={() => handleClick('favorites')}>
               <p>Favorites</p>
               <p>&#10095;</p>
            </div>
         </div>
         <InfoBar
            sideBar={sideBar}
            infoBar={infoBar}
            setInfoBar={setInfoBar}
            setButtonActive={setButtonActive}
         />
      </>
   );

   function handleClick(value) {
      setInfoBar(true);
      setButtonActive(value);
      if (window.innerWidth < 600) {
         setSideBar(false);
         console.log('hi');
      }
   }
}

export default SideBar;