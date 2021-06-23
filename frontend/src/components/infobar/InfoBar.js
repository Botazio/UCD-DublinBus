import InfobarCSS from './Infobar.module.css';
import { ReactComponent as Close } from './fixtures/icon-close.svg';
import Directions from '../directions/Directions';
import Stops from '../stops/Stops';
import MapSwitcher from '../map-switcher/MapSwitcher';

// InfoBar is a subcomponent of SideBar
const InfoBar = ({ sideBar, setInfoBar, infoBar, buttonActive, setButtonActive }) => {
   // If infobar is not active we do not return anything
   if (!infoBar) return '';

   return (
      <>
         <div className={InfobarCSS.map_switcher}>
            <MapSwitcher />
         </div>
         {/* The styles for the infobar depends on the sidebar position */}
         <div className={InfobarCSS.infobar + " " + (sideBar ? InfobarCSS.infobar_sidebar_active : InfobarCSS.infobar_sidebar_inactive)}>
            <div className={InfobarCSS.close_button} onClick={() => handleClose()}>
               <Close height={'15'} />
            </div>
            {buttonActive === 'directions' && <Directions />}
            {buttonActive === 'stops' && <Stops />}
         </div>
      </>
   );

   function handleClose() {
      setInfoBar(false);
      setButtonActive('');
   }
}

export default InfoBar;