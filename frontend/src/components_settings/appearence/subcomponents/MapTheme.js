import { Button, makeStyles, useTheme } from "@material-ui/core";
import { useState } from "react";
import Action from "../../../reusable-components/action/Action";
import AppearenceCSS from "../Appearence.module.css";
import DisplayMapBox from "./DisplayMapBox";
import MapThemesButtons from "./MapThemesButtons";

const useStyles = makeStyles((theme) => ({
   root: {
      border: "1px solid" + theme.user.primary,
      color: theme.user.primary,
      backgroundColor: theme.user.background_1
   },
}));

// Defines how the map looks offering the user to select between predefined options
const MapTheme = () => {
   const [action, setAction] = useState(false);
   const currentTheme = useTheme();
   const [boxTheme, setBoxTheme] = useState(currentTheme);
   const classes = useStyles(currentTheme);

   const actionMessage = "Change map";

   return (
      <>
         <div className={AppearenceCSS.theme_box}>
            <div className={AppearenceCSS.theme_header}>
               <h3>Map themes</h3>
            </div>
            <div className={AppearenceCSS.theme_info}>
               <p>Select one of our predefined themes using the buttons down below.</p>
               <DisplayMapBox boxTheme={boxTheme} />
               <MapThemesButtons setBoxTheme={setBoxTheme} />
               {JSON.stringify(currentTheme.map) !== JSON.stringify(boxTheme.map) &&
                  <Button
                     classes={{ root: classes.root }} onClick={() => setAction(true)}>change theme
                  </Button>}
            </div>
         </div>

         {/* Display an action if it is active */}
         {action && <Action message={actionMessage} type="theme" color="primary" buttonMessage="Change map" setAction={setAction} />}
      </>
   );
};

export default MapTheme;