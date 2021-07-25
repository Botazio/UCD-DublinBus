import { Button, createTheme, TextField, ThemeProvider } from "@material-ui/core";
import { ReactComponent as IconClose } from "../../fixtures/icons/icon-close.svg";
import ActionCSS from "./Action.module.css";
import { useAuth } from "../../providers/AuthContext";


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
   const { currentUser, setCurrentUser } = useAuth();

   return (
      <>
         <div className={ActionCSS.action_wrapper}>
            <div className={ActionCSS.action_header}>
               <h3>{message}</h3>
               <IconClose height={"14"} onClick={() => setAction(false)} />
            </div>
            {inputField &&
               <div className={ActionCSS.action_info}>
                  <TextField id="outlined-basic" variant="outlined" size="small" fullWidth={true} />
                  <p>Choose a new {type}</p>
               </div>}
            <div className={ActionCSS.action_submit}>
               <ThemeProvider theme={theme}>
                  <Button variant="contained" fullWidth={true} color={color} onClick={() => handleSubmit(currentUser, setCurrentUser)}>
                     {buttonMessage}
                  </Button>
               </ThemeProvider>
            </div>
            {type === "photo" && <div className={ActionCSS.action_submit}>
               <ThemeProvider theme={theme}>
                  <Button variant="contained" fullWidth={true} color="secondary">
                     Remove current photo
                  </Button>
               </ThemeProvider>
            </div>}
         </div>

         {/* Translucid dark background for the action component. */}
         <div className={ActionCSS.action_background_wrapper} onClick={() => setAction(false)}>
         </div>
      </>
   );
};

export default Action;;