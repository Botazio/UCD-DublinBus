import { Button } from "@material-ui/core";
import ProfileCSS from "../Profile.module.css";

const DeleteAccount = () => {
   return (
      <div className={ProfileCSS.delete_account_wrapper}>
         <div className={ProfileCSS.delete_account_header}>
            <h2>Delete account</h2>
         </div>
         <div className={ProfileCSS.delete_account_info}>
            <p>Deleting your account is permanent. Are you sure you want to do it?</p>
            <Button variant="outlined" color="secondary" size="small" >
               delete account
            </Button>
         </div>
      </div>
   );
};

export default DeleteAccount;