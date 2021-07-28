import { Button } from "@material-ui/core";
import { useState } from "react";
import ProfileCSS from "../Profile.module.css";
import Action from "../../../reusable-components/action/Action";
import SettingsHeader from "../../../reusable-components/settings-header.js/SettingsHeader";

const UserName = () => {
   const [action, setAction] = useState(false);

   const actionMessage = "Enter a new username";

   // messages to display in the header
   const headerTitle = "Change username";
   const headerBody = "Changing your username can have unintended side effects.";

   return (
      <>
         <div className={ProfileCSS.username_wrapper}>
            <SettingsHeader title={headerTitle} body={headerBody} />
            <Button variant="outlined" size="small" onClick={() => setAction(true)}>
               change username
            </Button>
         </div>

         {/* Display an action if it is active */}
         {action && <Action message={actionMessage} type="name" color="primary" buttonMessage="Change my username" inputField="true" setAction={setAction} />}
      </>
   );
};

export default UserName;