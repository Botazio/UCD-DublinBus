import { useAuth } from "../../../../providers/AuthContext";

const MyStops = () => {
   const { currentUser } = useAuth();
   const favoriteStops = currentUser.favouritestops;

   return (
      <>

         {favoriteStops && favoriteStops.map((stop) => <div>

         </div>)}

      </>

   );
};

export default MyStops;