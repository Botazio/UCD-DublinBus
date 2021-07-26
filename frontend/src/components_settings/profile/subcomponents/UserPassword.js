import { Button } from "@material-ui/core";
import { useState } from "react";
import ProfileCSS from "../Profile.module.css";
import Action from "../../../reusable-components/action/Action";
import SettingsHeader from "../../../reusable-components/settings-header.js/SettingsHeader";

const UserPassword = () => {
   const [action, setAction] = useState(false);

   const actionMessage = "Enter a new password";

   // messages to display in the header
   const headerTitle = "Change password";
   const headerBody = "Make sure it's at least 5 characters.";

   return (
      <>
         <div className={ProfileCSS.userpassword_wrapper}>
            <SettingsHeader title={headerTitle} body={headerBody} />
            <Button variant="outlined" size="small" onClick={() => setAction(true)}>
               change password
            </Button>
         </div>

         {/* Display an action if it is active */}
         {action && <Action message={actionMessage} type="password" color="primary" buttonMessage="Change my password" inputField="true" setAction={setAction} />}
      </>
   );
};

export default UserPassword;