import { Button } from "@material-ui/core";
import { useState } from "react";
import { useAuth } from "../../../providers/AuthContext";
import ProfileCSS from "../Profile.module.css";
import Action from "./Action";

const UserMail = () => {
   const [action, setAction] = useState(false);

   const { currentUser } = useAuth();

   const actionMessage = "Enter a new email";

   return (
      <>
         <div className={ProfileCSS.usermail_wrapper}>
            <div className={ProfileCSS.usermail_header}>
               <h2>Change user email</h2>
            </div>
            <div className={ProfileCSS.usermail_info}>
               <p>Changing your email can have unintended side effects.</p>
               <p>Current email: {currentUser.email}</p> {/* is not defined yet */}
               <Button variant="outlined" size="small" onClick={() => setAction(true)} >
                  change email
               </Button>
            </div>
         </div>

         {/* Display an action if it is active */}
         {action && <Action message={actionMessage} type="email" color="primary" buttonMessage="Change my email" setAction={setAction} />}
      </>
   );
};

export default UserMail;