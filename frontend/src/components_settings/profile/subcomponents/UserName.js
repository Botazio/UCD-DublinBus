import { useState } from "react";
import ProfileCSS from "../Profile.module.css";
import Action from "../../../reusable-components/action/Action";
import SettingsHeader from "../../../reusable-components/settings-header.js/SettingsHeader";
import SecondaryButton from "../../../reusable-components/custom-buttons/SecondaryButton";

// This component renders a header and a button that allows the user 
// to change his user name. The function to change the name is passed 
// to the action subcomponent
const UserName = () => {
   // State that controls when to display the action
   const [action, setAction] = useState(false);

   // Message to display in the action
   const actionMessage = "Enter a new username";

   // Messages to display in the header
   const headerTitle = "Change username";
   const headerBody = "Changing your username can have unintended side effects.";

   return (
      <>
         <div className={ProfileCSS.username_wrapper}>
            <SettingsHeader title={headerTitle} body={headerBody} />
            <SecondaryButton variant="outlined" size="small" onClick={() => setAction(true)}>
               change username
            </SecondaryButton>
         </div>

         {/* Display an action if it is active */}
         {action && <Action message={actionMessage} type="name" color="primary" buttonMessage="Change my username" inputField="true" setAction={setAction} />}
      </>
   );
};

export default UserName;