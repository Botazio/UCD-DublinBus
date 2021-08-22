import { useState } from "react";
import ProfileCSS from "../Profile.module.css";
import SettingsHeader from "../../../reusable-components/settings-header.js/SettingsHeader";
import ActionWrapper from "../../../reusable-components/action/ActionWrapper";
import ActionUserName from "../../../reusable-components/action/ActionUserName";
import { Button } from "@material-ui/core";

// This component renders a header and a button that allows the user 
// to change his user name. The function to change the name is passed 
// to the action subcomponent
const UserName = () => {
   // State that controls when to display the action
   const [action, setAction] = useState(false);

   // Message to display in the action
   const actionTitle = "Enter a new username";

   // Messages to display in the header
   const headerTitle = "Change username";
   const headerBody = "Changing your username can have unintended side effects.";

   return (
      <>
         <div className={ProfileCSS.username_wrapper}>
            <SettingsHeader title={headerTitle} body={headerBody} />
            <Button color="primary" variant="outlined" size="small" onClick={() => setAction(true)}>
               change username
            </Button>
         </div>

         {/* Display an action if it is active */}
         {action && <ActionWrapper title={actionTitle} setAction={setAction}>
            <ActionUserName />
         </ActionWrapper>}
      </>
   );
};

export default UserName;