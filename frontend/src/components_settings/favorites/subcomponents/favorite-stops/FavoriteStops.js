import { useState } from "react";
import HeaderSwitch from "../HeaderSwitch";
import AllStops from "./AllStops";
import MyStops from "./MyStops";
import FavoritesCSS from "../../Favorites.module.css";
import { useTheme } from "@material-ui/core";

// This is the main component for the favorite stops section
// Allows the user to switch between all stops and the user favorite stops
const FavoriteStops = () => {
   // This is state is used as a toogle. If it is false stops is active,
   // if it is true mystops is active.
   const [activeHeader, setActiveHeader] = useState(false);

   // Grab the theme from the provider
   const theme = useTheme().theme;

   return (
      <div className={FavoritesCSS.container} style={{ border: `1px solid ${theme.divider}` }}>
         <HeaderSwitch header1="All stops" header2="My stops" activeHeader={activeHeader} setActiveHeader={setActiveHeader} />

         {/* If active header is false render all the stops */}
         {!activeHeader && <AllStops />}

         {/* If active header is true render the user favorite stops */}
         {activeHeader && <MyStops />}
      </div>
   );
};

export default FavoriteStops;