import { Dialog } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthContext";

// This component waits x time before it displays a dialog
// Is only available for registered users
const DialogWrapper = ({ time, children, ...restProps }) => {
   // State to control when the dialog is open
   const [open, setOpen] = useState(false);

   // Grab the user from the provider
   const { currentUser } = useAuth();

   // Opens the dialog the first time the component renders
   // after a customizable amount of time
   useEffect(() => {
      setTimeout(() => {
         setOpen(true);
      }, [time]);
   }, [time]);

   const handleClose = () => {
      setOpen(false);
   };

   // If there is no user login return
   if (!currentUser) return "";

   return (
      <Dialog
         open={open}
         onClose={handleClose}
         {...restProps}
      >
         {children}
      </Dialog>
   );
};

export default DialogWrapper;