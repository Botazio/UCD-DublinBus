import FavoritesCSS from "../../Favorites.module.css";
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { useState } from "react";
import { useTheme } from "@material-ui/core";

// Small reusable component that displays a container for each stop
// The container changes the background with colors from the provider
// when it is clicked 
const StopContainer = ({ stop, activeStops, setActiveStops, type }) => {
   const [active, setActive] = useState(isActive());

   // Grab the theme from the provider
   const themeContext = useTheme();

   // Toogles the active state. Adds and deletes the stop for the activeStops array
   function handleClick() {
      if (active) {
         const newArray = [...activeStops];
         newArray.pop(stop);
         setActiveStops(newArray);
         setActive(false);
      }
      if (!active) {
         setActiveStops([...activeStops, stop]);
         setActive(true);
      }
   }

   // Handles the style of the stop container depending on the active state
   function handleStyle() {
      if (!active) {
         return themeContext.theme.background_primary;
      }
      if (type === "add") {
         return themeContext.theme.primary + 30;
      }
      if (type === "delete") {
         return themeContext.palette.secondary.main + 30;
      }
   }

   return (
      <div
         className={FavoritesCSS.stop_wrapper}
         onClick={() => handleClick()}
         /* Change the background depending on the state */
         style={{ backgroundColor: handleStyle(), borderTop: `1px solid ${themeContext.theme.divider}` }}>
         <div className={FavoritesCSS.stop_header}>
            <div className={FavoritesCSS.stop_title}>
               <h4>{stop.stop_name}</h4>
            </div>
            <div className={FavoritesCSS.stop_lines}>
               {stop.stop_lines.map((line, index) => (<div key={line + index} style={{ border: `1px solid ${themeContext.theme.divider}` }}>{line}</div>))}
            </div>
         </div>

         {/* Show a different icon depending on the type */}
         {type === "add" && <div className={FavoritesCSS.icon}><AddRoundedIcon /></div>}
         {type === "delete" && <div className={FavoritesCSS.icon}><CloseRoundedIcon /></div>}
      </div>
   );

   // Function that checks if the stop is active the first time the component renders
   function isActive() {
      if (activeStops.includes(stop)) {
         return true;
      };
      return false;
   }
};

export default StopContainer;