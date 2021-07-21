import { Button, createTheme, TextField, ThemeProvider } from "@material-ui/core";
import { ReactComponent as IconClose } from "../../../fixtures/icons/icon-close.svg";
import ProfileCSS from "../Profile.module.css";
import { useAuth } from "../../../providers/AuthContext";


const theme = createTheme({
   palette: {
      primary: {
         main: 'rgb(148, 211, 162)',
         contrastText: 'white'
      }
   },
});

// This component displays a customized action when one of the buttons in profile is clicked
const Action = ({ message, buttonMessage, type, color, setAction }) => {
   const { currentUser } = useAuth();

   return (
      <>
         <div className={ProfileCSS.action_wrapper}>
            <div className={ProfileCSS.action_header}>
               <h3>{message}</h3>
               <IconClose height={"14"} onClick={() => setAction(false)} />
            </div>
            {type !== "delete" && type !== "photo" &&
               <div className={ProfileCSS.action_info}>
                  <TextField id="outlined-basic" variant="outlined" size="small" fullWidth={true} />
                  <p>Choose a new {type}</p>
               </div>}
            <div className={ProfileCSS.action_submit}>
               <ThemeProvider theme={theme}>
                  <Button variant="contained" fullWidth={true} color={color}>
                     {buttonMessage}
                  </Button>
               </ThemeProvider>
            </div>
            {type === "photo" && <div className={ProfileCSS.action_submit}>
               <ThemeProvider theme={theme}>
                  <Button variant="contained" fullWidth={true} color="secondary">
                     Remove current photo
                  </Button>
               </ThemeProvider>
            </div>}
         </div>

         <div className={ProfileCSS.action_background_wrapper} onClick={() => setAction(false)}>
         </div>
      </>
   );
};

export default Action;;