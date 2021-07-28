import { Button } from "@material-ui/core";
import { useState } from "react";
import ProfileCSS from "../Profile.module.css";
import Action from "../../../reusable-components/action/Action";
import SettingsHeader from "../../../reusable-components/settings-header.js/SettingsHeader";

const DeleteAccount = () => {
   const [action, setAction] = useState(false);

   const actionMessage = "Delete account";

   // messages to display in the header
   const headerTitle = "Delete account";
   const headerBody = "Deleting your account is permanent. Are you sure you want to do it?";

   return (
      <>
         <div className={ProfileCSS.delete_account_wrapper}>
            <SettingsHeader title={headerTitle} body={headerBody} headerColor={"rgb(203, 36, 49"} />
            <Button variant="outlined" color="secondary" size="small" onClick={() => setAction(true)} >
               delete account
            </Button>
         </div>

         {/* Display an action if it is active */}
         {action && <Action message={actionMessage} type="delete" color="secondary" buttonMessage="Delete" setAction={setAction} />}
      </>
   );
};

export default DeleteAccount;