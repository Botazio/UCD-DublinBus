import FavoritesCSS from "../../Favorites.module.css";
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { useState } from "react";
import { useTheme } from "@material-ui/core";
import { useEffect } from "react";

// Small reusable component that displays a container for each stop
// The container changes the background with colors from the provider
// when it is clicked 
const StopContainer = ({ stop, activeStops, setActiveStops, type }) => {
   const [active, setActive] = useState(false);

   // Grab the theme from the provider
   const themeContext = useTheme();

   // This useEffect is called when active changes.
   // Adding and deleting elements from the array depending on the active state
   useEffect(() => {
      // Toogle that stop from the activeStops array
      if (active) {
         setActiveStops([...activeStops, stop]);
      }
      if (!active) {
         const newArray = [...activeStops];
         newArray.pop(stop);
         setActiveStops(newArray);
      }
      // eslint-disable-next-line
   }, [active]);

   function handleClick() {
      // Toogle the active state for that stop
      setActive(!active);
   }

   function handleStyle() {
      if (!active) {
         return themeContext.theme.background_primary;
      }
      if (type === "add") {
         return themeContext.theme.primary + 10;
      }
      if (type === "delete") {
         return themeContext.palette.secondary.main + 10;
      }
   }

   return (
      <div
         className={FavoritesCSS.stop_wrapper}
         onClick={() => handleClick()}
         /* Change the background depending on the state */
         style={{ backgroundColor: handleStyle() }}>
         <div className={FavoritesCSS.stop_header}>
            <div className={FavoritesCSS.stop_title}>
               <h4>{stop.stop_name}</h4>
            </div>
            <div className={FavoritesCSS.stop_lines}>
               {stop.stop_lines.map((line, index) => (<div key={line + index}>{line}</div>))}
            </div>
         </div>

         {/* Show a different icon depending on the type */}
         {type === "add" && <div className={FavoritesCSS.icon}><AddRoundedIcon /></div>}
         {type === "delete" && <div className={FavoritesCSS.icon}><CloseRoundedIcon /></div>}
      </div>
   );
};

export default StopContainer;