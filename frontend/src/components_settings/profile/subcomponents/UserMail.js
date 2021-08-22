import { useState } from "react";
import { useAuth } from "../../../providers/AuthContext";
import ProfileCSS from "../Profile.module.css";
import SettingsHeader from "../../../reusable-components/settings-header.js/SettingsHeader";
import ActionWrapper from "../../../reusable-components/action/ActionWrapper";
import ActionEmail from "../../../reusable-components/action/ActionEmail";
import { Button } from "@material-ui/core";

// This component renders a header and a button that allows the user 
// to change his user mail. The function to change the email is passed 
// to the action subcomponent
const UserMail = () => {
   // State that controls when to display the action
   const [action, setAction] = useState(false);

   // Grab the current user from the provider
   const { currentUser } = useAuth();

   // Message to display in the action
   const actionTitle = "Enter a new email";

   // Messages to display in the header
   const headerTitle = "Change user email";
   const headerBody = "Changing your email can have unintended side effects.";

   return (
      <>
         <div className={ProfileCSS.usermail_wrapper}>
            <SettingsHeader title={headerTitle} body={headerBody} />
            <p>Current email: {currentUser.email}</p> {/* is not defined yet */}
            <Button color="primary" variant="outlined" size="small" onClick={() => setAction(true)} >
               change email
            </Button>
         </div>

         {/* Display an action if it is active */}
         {action && <ActionWrapper title={actionTitle} setAction={setAction}>
            <ActionEmail />
         </ActionWrapper>}
      </>
   );
};

export default UserMail;