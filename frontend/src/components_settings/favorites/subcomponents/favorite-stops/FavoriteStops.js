import { useState } from "react";
import HeaderSwitch from "../HeaderSwitch";
import AllStops from "./AllStops";
import MyStops from "./MyStops";
import FavoritesCSS from "../../Favorites.module.css";

// This is the main component for the favorite stops section
// Allows the user to switch between all stops and the user favorite stops
const FavoriteStops = () => {
   // This is state is used as a toogle. If it is false stops is active,
   // if it is true mystops is active.
   const [activeHeader, setActiveHeader] = useState(false);

   return (
      <div className={FavoritesCSS.container}>
         <HeaderSwitch header1="All stops" header2="My stops" activeHeader={activeHeader} setActiveHeader={setActiveHeader} />

         {/* If active header is false render all the stops */}
         {!activeHeader && <AllStops />}

         {/* If active header is true render the user favorite stops */}
         {activeHeader && <MyStops />}
      </div>
   );
};

export default FavoriteStops;