import { Button } from "@material-ui/core";
import { useState } from "react";
import ProfileCSS from "../Profile.module.css";
import Action from "../../../reusable-components/action/Action";

const DeleteAccount = () => {
   const [action, setAction] = useState(false);

   const actionMessage = "Delete account";

   return (
      <>
         <div className={ProfileCSS.delete_account_wrapper}>
            <div className={ProfileCSS.delete_account_header}>
               <h2>Delete account</h2>
            </div>
            <div className={ProfileCSS.delete_account_info}>
               <p>Deleting your account is permanent. Are you sure you want to do it?</p>
               <Button variant="outlined" color="secondary" size="small" onClick={() => setAction(true)} >
                  delete account
               </Button>
            </div>
         </div>

         {/* Display an action if it is active */}
         {action && <Action message={actionMessage} type="delete" color="secondary" buttonMessage="Delete" setAction={setAction} />}
      </>
   );
};

export default DeleteAccount;