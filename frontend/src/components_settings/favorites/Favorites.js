import SettingsHeader from "../../reusable-components/settings-header.js/SettingsHeader";
import FavoriteLines from "./subcomponents/favorite-lines/FavoriteLines";
import FavoriteStops from "./subcomponents/favorite-stops/FavoriteStops";

// messages to display in the reusable headers
const stopsTitle = "Favorite stops";
const stopsBody = "Manage your favorite stops from here!";
const linesTitle = "Favorite lines";
const linesBody = "Manage your favorite lines from here!";

// This is the main component for the favorites section
const Favorites = () => {
   return (
      <>
         {/* Favorite stops header */}
         <SettingsHeader title={stopsTitle} body={stopsBody} />

         {/* Main component for the favorite stops */}
         <FavoriteStops />

         {/* Favorite lines header */}
         <SettingsHeader title={linesTitle} body={linesBody} />

         {/* Main component for the favorite lines */}
         <FavoriteLines />
      </>
   );
};

export default Favorites;