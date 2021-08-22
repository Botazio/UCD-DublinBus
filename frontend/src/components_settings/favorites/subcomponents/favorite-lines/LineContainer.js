import FavoritesCSS from "../../Favorites.module.css";
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { useState } from "react";
import { useTheme } from "@material-ui/core";

// Small reusable component that displays a container for each line
// The container changes the background with colors from the provider
// when it is clicked 
const LineContainer = ({ line, activeLines, setActiveLines, type }) => {
   const [active, setActive] = useState(isActive());

   // Grab the theme from the provider
   const themeContext = useTheme();

   // Toogles the active state. Adds and deletes the line for the activeLines array
   function handleClick() {
      if (active) {
         const newArray = [...activeLines];
         newArray.pop(line);
         setActiveLines(newArray);
         setActive(false);
      }
      if (!active) {
         setActiveLines([...activeLines, line]);
         setActive(true);
      }
   }

   // Handles the style of the line container depending on the active state
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
         className={FavoritesCSS.line_wrapper}
         onClick={() => handleClick()}
         /* Change the background depending on the state */
         style={{ backgroundColor: handleStyle(), borderTop: `1px solid ${themeContext.theme.divider}` }}>
         <div className={FavoritesCSS.line_header}>
            <h4>Line {line.route__route_short_name}</h4>
            <p>{line.trip_headsign}</p>
         </div>

         {/* Show a different icon depending on the type */}
         {type === "add" && <div className={FavoritesCSS.icon}><AddRoundedIcon /></div>}
         {type === "delete" && <div className={FavoritesCSS.icon}><CloseRoundedIcon /></div>}
      </div>
   );

   // Function that checks if the stop is active the first time the component renders
   function isActive() {
      if (activeLines.includes(line)) {
         return true;
      };
      return false;
   }
};

export default LineContainer;