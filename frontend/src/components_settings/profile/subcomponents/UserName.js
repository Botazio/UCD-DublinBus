import { Button } from "@material-ui/core";
import { useState } from "react";
import ProfileCSS from "../Profile.module.css";
import Action from "../../../reusable-components/action/Action";

const UserName = () => {
   const [action, setAction] = useState(false);

   const actionMessage = "Enter a new username";

   return (
      <>
         <div className={ProfileCSS.username_wrapper}>
            <div className={ProfileCSS.username_header}>
               <h2>Change username</h2>
            </div>
            <div className={ProfileCSS.username_info}>
               <p>Changing your username can have unintended side effects.</p>
               <Button variant="outlined" size="small" onClick={() => setAction(true)}>
                  change username
               </Button>
            </div>
         </div>

         {/* Display an action if it is active */}
         {action && <Action message={actionMessage} type="name" color="primary" buttonMessage="Change my username" setAction={setAction} />}
      </>
   );
};

export default UserName;