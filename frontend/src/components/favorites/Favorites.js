import { useState } from "react";
import { useAuth } from "../../providers/AuthContext";
import CustomError from "../../reusable-components/error/CustomError";
import StopsLinesToogle from "../../reusable-components/stops-lines-toogle/StopsLinesToogle";
import FavoriteLines from "./subcomponents/FavoriteLines";
import FavoriteStops from "./subcomponents/FavoriteStops";

// This is the main component for the favorites section
const Favorites = () => {
   // State to handle when the user is searching for stops or for lines
   const [active, setActive] = useState("stops");

   // Call the context to check if there is a user 
   const { currentUser } = useAuth();

   // Display an error message if there is no user authenticated
   if (!currentUser) return <CustomError height="60" message="Registered users only" />;

   return (
      <>
         {/* Toogle buttons to select between lines and stops */}
         <StopsLinesToogle active={active} setActive={setActive} />

         {/* Display a message if the user don't have any favorite stops */}
         {(active === "stops") && (currentUser.favoritestops.length === 0) && <CustomError height="60" message="No favorite stops" />}

         {/* Display the favorite stops */}
         {(active === "stops") && (currentUser.favoritestops.length !== 0) && <FavoriteStops />}


         {/* Display a message if the user don't have any favorite lines */}
         {(active === "lines") && (currentUser.favoritelines.length === 0) && <CustomError height="60" message="No favorite lines" />}

         {/* Display the favorite lines */}
         {(active === "lines") && (currentUser.favoritelines.length !== 0) && <FavoriteLines />}

      </>
   );
};

export default Favorites;