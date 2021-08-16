import AppearenceCSS from "../Appearence.module.css";
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

// This components shows the styles in a small box that simulates a common user interface
// Takes the styles from the box theme
const DisplayThemeBox = ({ boxTheme }) => {
   return (
      <div className={AppearenceCSS.display_theme_box} style={{ border: "1px solid " + boxTheme.theme.divider, backgroundColor: boxTheme.theme.background_primary }}>
         <div className={AppearenceCSS.display_theme_navbar} style={{ backgroundColor: boxTheme.theme.background_secondary }}>
            <div className={AppearenceCSS.display_theme_button} style={{ border: "1px solid " + boxTheme.theme.divider }}></div>
            <div className={AppearenceCSS.display_theme_button} style={{ border: "1px solid " + boxTheme.theme.divider }}></div>
            <div className={AppearenceCSS.display_theme_button} style={{ border: "1px solid " + boxTheme.theme.divider }}></div>
         </div>
         <div className={AppearenceCSS.display_theme_body}>
            <div className={AppearenceCSS.display_theme_body_menu} style={{ backgroundColor: boxTheme.theme.background_secondary }}>
               <div className={AppearenceCSS.display_theme_body_bar} style={{ backgroundColor: boxTheme.theme.primary + "60" }}>
                  <div className={AppearenceCSS.display_theme_button_color} style={{ backgroundColor: boxTheme.theme.primary }}></div>
               </div>
            </div>
            <div className={AppearenceCSS.display_theme_body_sidebar} style={{ backgroundColor: boxTheme.theme.background_secondary }}>
               <CloseRoundedIcon htmlColor={boxTheme.theme.icon_color} />
            </div>
         </div>

      </div>
   );
};

export default DisplayThemeBox;