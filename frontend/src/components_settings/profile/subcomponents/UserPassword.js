import { useState } from "react";
import ProfileCSS from "../Profile.module.css";
import SettingsHeader from "../../../reusable-components/settings-header.js/SettingsHeader";
import ActionPassword from "../../../reusable-components/action/ActionPassword";
import ActionWrapper from "../../../reusable-components/action/ActionWrapper";
import { Button } from "@material-ui/core";

// This component renders a header and a button that allows the user 
// to change his password. The function to change the password is passed 
// to the action subcomponent
const UserPassword = () => {
   // State that controls when to display the action
   const [action, setAction] = useState(false);

   // Message to display in the action
   const actionTitle = "Enter a new password";

   // Messages to display in the header
   const headerTitle = "Change password";
   const headerBody = "Make sure it's at least 5 characters.";

   return (
      <>
         <div className={ProfileCSS.userpassword_wrapper}>
            <SettingsHeader title={headerTitle} body={headerBody} />
            <Button color="primary" variant="outlined" size="small" onClick={() => setAction(true)}>
               change password
            </Button>
         </div>

         {/* Display an action if it is active */}
         {action && <ActionWrapper title={actionTitle} setAction={setAction}>
            <ActionPassword />
         </ActionWrapper>}
      </>
   );
};

export default UserPassword;