import { Button } from "@material-ui/core";
import { useState } from "react";
import ProfileCSS from "../Profile.module.css";
import SettingsHeader from "../../../reusable-components/settings-header.js/SettingsHeader";
import ActionDelete from "../../../reusable-components/action/ActionDelete";
import ActionWrapper from "../../../reusable-components/action/ActionWrapper";

// This component renders a header and a button that allows the user 
// to delete his account. The function to delete the account is passed 
// to the action subcomponent
const DeleteAccount = () => {
   // State that controls when to display the action
   const [action, setAction] = useState(false);

   // Messages to display in the header
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
         {action && <ActionWrapper title={"Delete account"} setAction={setAction}>
            <ActionDelete />
         </ActionWrapper>}
      </>
   );
};

export default DeleteAccount;