import { useState } from "react";
import ProfileCSS from "../Profile.module.css";
import Action from "../../../reusable-components/action/Action";
import SettingsHeader from "../../../reusable-components/settings-header.js/SettingsHeader";
import SecondaryButton from "../../../reusable-components/custom-buttons/SecondaryButton";

// This component renders a header and a button that allows the user 
// to change his password. The function to change the password is passed 
// to the action subcomponent
const UserPassword = () => {
   // State that controls when to display the action
   const [action, setAction] = useState(false);

   // Message to display in the action
   const actionMessage = "Enter a new password";

   // Messages to display in the header
   const headerTitle = "Change password";
   const headerBody = "Make sure it's at least 5 characters.";

   return (
      <>
         <div className={ProfileCSS.userpassword_wrapper}>
            <SettingsHeader title={headerTitle} body={headerBody} />
            <SecondaryButton variant="outlined" size="small" onClick={() => setAction(true)}>
               change password
            </SecondaryButton>
         </div>

         {/* Display an action if it is active */}
         {action && <Action message={actionMessage} type="password" color="primary" buttonMessage="Change my password" inputField="true" setAction={setAction} />}
      </>
   );
};

export default UserPassword;