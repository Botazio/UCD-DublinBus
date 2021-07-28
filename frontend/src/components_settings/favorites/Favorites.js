import SettingsHeader from "../../reusable-components/settings-header.js/SettingsHeader";
import FavoriteStops from "./subcomponents/favorite-stops/FavoriteStops";

// messages to display in the reusable header
const stopsTitle = "Favorite stops";
const stopsBody = "Manage your favorite stops from here!";

// This is the main component for the favorites section
const Favorites = () => {
   return (
      <>
         <SettingsHeader title={stopsTitle} body={stopsBody} />

         {/* Main component for the favorite stops */}
         <FavoriteStops />
      </>
   );
};

export default Favorites;