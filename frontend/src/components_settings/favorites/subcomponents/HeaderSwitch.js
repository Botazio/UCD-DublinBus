import FavoritesCSS from "../Favorites.module.css";

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