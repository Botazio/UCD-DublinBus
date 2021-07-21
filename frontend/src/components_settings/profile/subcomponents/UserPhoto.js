import { Avatar, Button } from "@material-ui/core";
import { useState } from "react";
import { useAuth } from "../../../providers/AuthContext";
import ProfileCSS from "../Profile.module.css";
import Action from "./Action";

const UserPhoto = () => {
   const [action, setAction] = useState(false);

   const { currentUser } = useAuth();

   const actionMessage = "Change profile photo";

   return (
      <>
         <div className={ProfileCSS.avatar_wrapper}>
            <Avatar className={ProfileCSS.avatar}>
               {currentUser.username.charAt(0)}
            </Avatar>
            <div className={ProfileCSS.avatar_header}>
               <h3>{currentUser.username}</h3>
               <Button variant="outlined" color="primary" size="small" onClick={() => setAction(true)}>
                  change profile photo
               </Button>
            </div>
         </div>

         {/* Display an action if it is active */}
         {action && <Action message={actionMessage} type="photo" color="primary" buttonMessage="Upload photo" setAction={setAction} />}
      </>
   );
};

export default UserPhoto;