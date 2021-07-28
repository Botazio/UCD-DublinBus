import AppearenceCSS from "../Appearence.module.css";
import CusThemesButtons from "./CusThemesButtons";
import DisplayThemeBox from "./DisplayThemeBox";
import PreThemesButtons from "./PreThemesButtons";
import { Button, useTheme, makeStyles } from "@material-ui/core";
import { useState } from "react";
import Action from "../../../reusable-components/action/Action";

const useStyles = makeStyles((theme) => ({
   root: {
      border: "1px solid" + theme.theme.primary,
      color: theme.theme.primary,
      backgroundColor: theme.theme.background_1
   },
}));


const ThemeBox = ({ title, info, type }) => {
   const [action, setAction] = useState(false);
   const currentTheme = useTheme();
   const [boxTheme, setBoxTheme] = useState(currentTheme);
   const classes = useStyles(currentTheme);

   const actionMessage = "Change theme";

   return (
      <>
         <div className={AppearenceCSS.theme_box}>
            <div className={AppearenceCSS.theme_header}>
               <h3>{title}</h3>
            </div>
            <div className={AppearenceCSS.theme_info}>
               <p>{info}</p>
               <DisplayThemeBox boxTheme={boxTheme} />
               {type === "predefined" && <PreThemesButtons boxTheme={boxTheme} setBoxTheme={setBoxTheme} />}
               {type === "custom" && <CusThemesButtons boxTheme={boxTheme} setBoxTheme={setBoxTheme} />}
               {JSON.stringify(currentTheme.theme) !== JSON.stringify(boxTheme.theme) &&
                  <Button
                     classes={{ root: classes.root }} onClick={() => setAction(true)}>change theme
                  </Button>}
            </div>
         </div>

         {/* Display an action if it is active */}
         {action && <Action message={actionMessage} type="theme" color="primary" buttonMessage="Change theme" setAction={setAction} />}
      </>
   );
};

export default ThemeBox;