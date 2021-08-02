import { useState } from "react";
import { useAuth } from "../../providers/AuthContext";
import CustomError from "../../reusable-components/error/CustomError";
import StopsLinesToogle from "../../reusable-components/stops-lines-toogle/StopsLinesToogle";
import { useStops } from "../../providers/StopsContext";

// This is the main component for the favorites section
const Favorites = () => {
   // State to handle when the user is searching for stops or for lines
   const [active, setActive] = useState('stops');

   // Call the context to check if there is a user 
   const { currentUser } = useAuth();

   const { data } = useStops();

   // Display an error message if there is no user authenticated
   if (!currentUser) return <CustomError height="60" message="Registered users only" />;

   currentUser.favoritestops = data.slice(0, 10);

   return (
      <>
         {/* Toogle buttons to select between lines and stops */}
         <StopsLinesToogle active={active} setActive={setActive} />

         {/* Display a message if the user don't have any favorite stops */}
         {!currentUser.favoritestops.length && <CustomError height="60" message="No favorite stops" />}
      </>
   );
};

export default Favorites;