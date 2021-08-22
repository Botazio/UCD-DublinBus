import FavoritesCSS from "../Favorites.module.css";
import { useTheme } from "@material-ui/core";

// Common component for lines and stops 
// Allows to switch between all the lines or stops to the user favorites 
const HeaderSwitch = ({ header1, header2, activeHeader, setActiveHeader }) => {
   // Grab the theme from the provider
   const theme = useTheme().theme;

   return (
      <div className={FavoritesCSS.switch_wrapper} style={{ borderBottom: `1px solid ${theme.divider}` }}>
         <div
            className={(!activeHeader ? FavoritesCSS.active_header : "")}
            onClick={() => setActiveHeader(false)}
            style={
               !activeHeader ?
                  { borderRight: `1px solid ${theme.divider}`, backgroundColor: theme.background_secondary } :
                  { borderRight: `1px solid ${theme.divider}` }}>
            <h3>{header1}</h3>
         </div>
         <div
            className={(activeHeader ? FavoritesCSS.active_header : "")}
            onClick={() => setActiveHeader(true)}
            style={activeHeader ? { backgroundColor: theme.background_secondary } : {}}>
            <h3>{header2}</h3>
         </div>
      </div>
   );
};

export default HeaderSwitch;