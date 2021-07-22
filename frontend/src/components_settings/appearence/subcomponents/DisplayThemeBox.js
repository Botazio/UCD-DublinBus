import AppearenceCSS from "../Appearence.module.css";
import { ReactComponent as IconClose } from "../../../fixtures/icons/icon-close.svg";


const DisplayThemeBox = ({ boxTheme }) => {
   return (
      <div className={AppearenceCSS.display_theme_box} style={{ border: "1px solid " + boxTheme.user.divider, backgroundColor: boxTheme.user.background_primary }}>
         <div className={AppearenceCSS.display_theme_navbar} style={{ backgroundColor: boxTheme.user.background_secondary }}>
            <div className={AppearenceCSS.display_theme_button} style={{ border: "1px solid " + boxTheme.user.divider }}></div>
            <div className={AppearenceCSS.display_theme_button} style={{ border: "1px solid " + boxTheme.user.divider }}></div>
            <div className={AppearenceCSS.display_theme_button} style={{ border: "1px solid " + boxTheme.user.divider }}></div>
         </div>
         <div className={AppearenceCSS.display_theme_body}>
            <div className={AppearenceCSS.display_theme_body_menu} style={{ backgroundColor: boxTheme.user.background_secondary }}>
               <div className={AppearenceCSS.display_theme_body_bar} style={{ backgroundColor: boxTheme.user.primary + "60" }}>
                  <div className={AppearenceCSS.display_theme_button_color} style={{ backgroundColor: boxTheme.user.primary }}></div>
               </div>
            </div>
            <div className={AppearenceCSS.display_theme_body_sidebar} style={{ backgroundColor: boxTheme.user.background_secondary }}>
               <IconClose fill={boxTheme.user.icons} width="10px" height="10px" ></IconClose>
            </div>
         </div>

      </div>
   );
};

export default DisplayThemeBox;