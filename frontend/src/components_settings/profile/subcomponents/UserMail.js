import { Button } from "@material-ui/core";
import { useState } from "react";
import { useAuth } from "../../../providers/AuthContext";
import ProfileCSS from "../Profile.module.css";
import Action from "../../../reusable-components/action/Action";
import SettingsHeader from "../../../reusable-components/settings-header.js/SettingsHeader";


const UserMail = () => {
   const [action, setAction] = useState(false);

   const { currentUser } = useAuth();

   const actionMessage = "Enter a new email";

   // messages to display in the header
   const headerTitle = "Change user email";
   const headerBody = "Changing your email can have unintended side effects.";

   return (
      <>
         <div className={ProfileCSS.usermail_wrapper}>
            <SettingsHeader title={headerTitle} body={headerBody} />
            <p>Current email: {currentUser.email}</p> {/* is not defined yet */}
            <Button variant="outlined" size="small" onClick={() => setAction(true)} >
               change email
            </Button>
         </div>

         {/* Display an action if it is active */}
         {action && <Action message={actionMessage} type="email" color="primary" buttonMessage="Change my email" setAction={setAction} />}
      </>
   );
};

export default UserMail;