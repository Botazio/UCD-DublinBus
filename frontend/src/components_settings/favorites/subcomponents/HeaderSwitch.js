import FavoritesCSS from "../Favorites.module.css";

// Common component for lines and stops 
// Allows to switch between all the lines or stops to the user favorites 
const HeaderSwitch = ({ header1, header2, activeHeader, setActiveHeader }) => {
   return (
      <div className={FavoritesCSS.switch_wrapper}>
         <div className={(!activeHeader ? FavoritesCSS.active_header : "")} onClick={() => setActiveHeader(false)}>
            <h3>{header1}</h3>
         </div>
         <div className={(activeHeader ? FavoritesCSS.active_header : "")} onClick={() => setActiveHeader(true)}>
            <h3>{header2}</h3>
         </div>
      </div>
   );
};

export default HeaderSwitch;