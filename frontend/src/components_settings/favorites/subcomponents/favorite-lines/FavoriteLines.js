import { useState } from "react";
import HeaderSwitch from "../HeaderSwitch";
import FavoritesCSS from "../../Favorites.module.css";
import AllLines from "./AllLines";
import MyLines from "./MyLines";

// This is the main component for the favorite lines section
// Allows the user to switch between all lines and the user favorite lines
const FavoriteLines = () => {
   // This is state is used as a toogle. If it is false all lines is active,
   // if it is true my lines is active.
   const [activeHeader, setActiveHeader] = useState(false);

   return (
      <div className={FavoritesCSS.container}>
         <HeaderSwitch header1="All lines" header2="My lines" activeHeader={activeHeader} setActiveHeader={setActiveHeader} />

         {/* If active header is false render all the stops */}
         {!activeHeader && <AllLines />}

         {/* If active header is true render the user favorite stops */}
         {activeHeader && <MyLines />}
      </div>
   );
};

export default FavoriteLines;