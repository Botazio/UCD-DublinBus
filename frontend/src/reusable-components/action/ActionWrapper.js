import { useState } from "react";
import ActionCSS from "./Action.module.css";
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { cloneElement } from "react";

const ActionWrapper = ({ children, title, setAction }) => {
   const [error, setError] = useState(null);
   const [isPending, setIsPending] = useState(false);
   const [OkMessage, setOkMessage] = useState(false);

   return (
      <>
         <div className={ActionCSS.action_wrapper}>
            {/* Action header */}
            <div className={ActionCSS.action_header}>
               <h3>{title}</h3>
               <CloseRoundedIcon onClick={() => handleActionClose()} />
            </div>

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

         </div>

         {/* Translucid dark background for the action component. */}
         <div className={ActionCSS.action_background_wrapper} onClick={() => handleActionClose()}></div>
      </>
   );

   function handleActionClose() {
      // Don't allow to close the action while is pending
      if (isPending) return;

      // Close the action
      setAction(false);
   }

};

export default ActionWrapper;