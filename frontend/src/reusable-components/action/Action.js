import { Button, createTheme, TextField, ThemeProvider } from "@material-ui/core";
import { ReactComponent as IconClose } from "../../fixtures/icons/icon-close.svg";
import ActionCSS from "./Action.module.css";
import { useAuth } from "../../providers/AuthContext";
import { useState } from "react";
import Waiting from "../waiting/Waiting";
import { Alert } from "@material-ui/lab";

const theme = createTheme({
   palette: {
      primary: {
         main: 'rgb(148, 211, 162)',
         contrastText: 'white'
      }
   },
});

// This component displays a customized action when one of the buttons in the settings section is clicked
const Action = ({ message, buttonMessage, type, color, inputField, setAction, handleSubmit }) => {
   const [error, setError] = useState(false);
   const [isPending, setIsPending] = useState(false);
   const [OkMessage, setOkMessage] = useState(false);

   // Grab the function from the provider
   const { isAuthenticated } = useAuth();

   return (
      <>
         <div className={ActionCSS.action_wrapper}>

            {/* Action header */}
            <div className={ActionCSS.action_header}>
               <h3>{message}</h3>
               <IconClose height={"14"} onClick={() => handleActionClose()} />
            </div>

            {/* In case input field is true display a text field */}
            {inputField &&
               <div className={ActionCSS.action_info}>
                  <TextField id="outlined-basic" variant="outlined" size="small" fullWidth={true} />
                  <p>Choose a new {type}</p>
               </div>}

            {/* In case type is password display a second text field */}
            {type === "password" &&
               <div className={ActionCSS.action_info}>
                  <TextField id="outlined-basic" variant="outlined" size="small" fullWidth={true} />
                  <p>Confirm your {type}</p>
               </div>}

            {/* Messages displayed to the user after the action is submitted */}
            {error && <div className={ActionCSS.message}><Alert severity="error">{error}</Alert></div>}
            {isPending && <div className={ActionCSS.message}><Waiting variant="dark" size="small" /></div>}
            {OkMessage && <div className={ActionCSS.message}><Alert severity="success">Action successful</Alert></div>}

            {/* Submit button */}
            <div className={ActionCSS.action_submit}>
               <ThemeProvider theme={theme}>
                  <Button disabled={isPending ? true : false} variant="contained" fullWidth={true} color={color} onClick={() => handleSubmit(setError, setIsPending, setOkMessage, isAuthenticated)}>
                     {buttonMessage}
                  </Button>
               </ThemeProvider>
            </div>

            {/* In case type is photo display a button to remove the photo */}
            {type === "photo" && <div className={ActionCSS.action_submit}>
               <ThemeProvider theme={theme}>
                  <Button variant="contained" fullWidth={true} color="secondary">
                     Remove current photo
                  </Button>
               </ThemeProvider>
            </div>}
         </div>

         {/* Translucid dark background for the action component. */}
         <div className={ActionCSS.action_background_wrapper} onClick={() => handleActionClose()}>
         </div>
      </>
   );

   function handleActionClose() {
      // Don't allow to close the action while is pending
      if (isPending) return;

      // Close the action
      setAction(false);
   }
};

export default Action;;