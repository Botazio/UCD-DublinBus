import { Dialog } from "@material-ui/core";
import { cloneElement, useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthContext";

// This component waits x time before it displays a dialog
// Is only available for registered users
const DialogWrapper = ({ time, children, ...restProps }) => {
   // State to control when the dialog is open
   const [action, setAction] = useState(false);
   // States to display the current state of the action
   const [error, setError] = useState(null);
   const [isPending, setIsPending] = useState(false);
   const [OkMessage, setOkMessage] = useState(false);

   // Grab the user from the provider
   const { currentUser } = useAuth();

   // Opens the dialog the first time the component renders
   // after a customizable amount of time
   useEffect(() => {
      // Variable that avoids updating the component when it is unmounted
      let mounted = true;

      setTimeout(() => {
         if (mounted) setAction(true);
      }, [time]);

      return () => {
         mounted = false;
      };

   }, [time]);

   const handleClose = () => {
      setAction(false);
   };

   // If there is no user login return
   if (!currentUser) return "";

   // If the user has deactivated the alerts return
   if (!currentUser.allow_feedback) return "";

   return (
      <Dialog
         open={action}
         onClose={handleClose}
         {...restProps}
      >
         {/* Render the children inside the wrapper and pass the props to it */}
         {cloneElement(children,
            {
               error: error,
               setError: setError,
               isPending: isPending,
               setIsPending: setIsPending,
               OkMessage: OkMessage,
               setOkMessage: setOkMessage,
               setAction: setAction
            }
         )}
      </Dialog>
   );
};

export default DialogWrapper;