import { Avatar } from "@material-ui/core";
import { useState } from "react";
import { useAuth } from "../../../providers/AuthContext";
import ProfileCSS from "../Profile.module.css";
import Action from "../../../reusable-components/action/Action";
import PrimaryButton from "../../../reusable-components/custom-buttons/PrimaryButton";

// This component renders a header and a button that allows the user 
// to change his profile photo. The functions to change the photo or delete it are passed 
// to the action subcomponent
const UserPhoto = () => {
   // State that controls when to display the action
   const [action, setAction] = useState(false);

   // Grab the current user from the provider 
   const { currentUser } = useAuth();

   // Message to display in the action
   const actionMessage = "Change profile photo";

   return (
      <>
         <div className={ProfileCSS.avatar_wrapper}>
            <Avatar className={ProfileCSS.avatar}>
               {currentUser.username.charAt(0)}
            </Avatar>
            <div className={ProfileCSS.avatar_header}>
               <h3>{currentUser.username}</h3>
               <PrimaryButton variant="outlined" color="primary" size="small" onClick={() => setAction(true)}>
                  change profile photo
               </PrimaryButton>
            </div>
         </div>

         {/* Display an action if it is active */}
         {action && <Action message={actionMessage} type="photo" color="primary" buttonMessage="Upload photo" setAction={setAction} />}
      </>
   );
};

export default UserPhoto;