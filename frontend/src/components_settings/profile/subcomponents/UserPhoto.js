import { Button } from "@material-ui/core";
import { useState } from "react";
import { useAuth } from "../../../providers/AuthContext";
import ProfileCSS from "../Profile.module.css";
import ActionWrapper from "../../../reusable-components/action/ActionWrapper";
import ActionPhoto from "../../../reusable-components/action/ActionPhoto";
import CustomAvatar from "../../../reusable-components/custom-avatar/CustomAvatar";

// This component renders a header and a button that allows the user 
// to change his profile photo. The functions to change the photo or delete it are passed 
// to the action subcomponent
const UserPhoto = () => {
   // State that controls when to display the action
   const [action, setAction] = useState(false);

   // Grab the current user from the provider 
   const { currentUser } = useAuth();

   // Message to display in the action
   const actionTitle = "Change profile photo";

   return (
      <>
         <div className={ProfileCSS.avatar_wrapper}>
            <CustomAvatar className={ProfileCSS.avatar} />
            <div className={ProfileCSS.avatar_header}>
               <h3>{currentUser.username}</h3>
               <Button variant="outlined" color="primary" size="small" onClick={() => setAction(true)}>
                  change profile photo
               </Button>
            </div>
         </div>

         {/* Display an action if it is active */}
         {action && <ActionWrapper title={actionTitle} setAction={setAction}>
            <ActionPhoto />
         </ActionWrapper>}
      </>
   );
};

export default UserPhoto;