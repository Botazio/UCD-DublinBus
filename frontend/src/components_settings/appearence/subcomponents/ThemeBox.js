import AppearenceCSS from "../Appearence.module.css";
import CusThemesButtons from "./CusThemesButtons";
import DisplayThemeBox from "./DisplayThemeBox";
import PreThemesButtons from "./PreThemesButtons";
import { useTheme } from "@material-ui/core";
import { useState } from "react";
import Action from "../../../reusable-components/action/Action";
import PrimaryButton from "../../../reusable-components/custom-buttons/PrimaryButton";
import { useEffect } from "react";


const ThemeBox = ({ title, info, type }) => {
   // State to control when to display the action component
   const [action, setAction] = useState(false);
   // State to control the box theme
   const [boxTheme, setBoxTheme] = useState();

   // Grabs the current theme from the provider and set the state of the boxTheme to it 
   // the first time the component renders
   const currentTheme = useTheme();
   useEffect(() => {
      setBoxTheme(currentTheme);
   }, [currentTheme]);

   // Do not return anything if there is no box theme 
   if (!boxTheme) return "";

   return (
      <>
         <div className={AppearenceCSS.theme_box}>
            {/* Theme box header and info */}
            <div className={AppearenceCSS.theme_header}>
               <h3>{title}</h3>
            </div>
            <div className={AppearenceCSS.theme_info}>
               <p>{info}</p>

               {/* Displays a box theme using the current state colors */}
               <DisplayThemeBox boxTheme={boxTheme} />

               {/* Render predefined buttons or custom buttons depending on the type */}
               {type === "predefined" && <PreThemesButtons boxTheme={boxTheme} setBoxTheme={setBoxTheme} />}
               {type === "custom" && <CusThemesButtons boxTheme={boxTheme} setBoxTheme={setBoxTheme} />}

               {/* Compares the current theme to the box theme if they are not equal render 
               a primary button. This button triggers the action when clicked */}
               {JSON.stringify(currentTheme.theme) !== JSON.stringify(boxTheme.theme) &&
                  <PrimaryButton
                     onClick={() => setAction(true)}>change theme
                  </PrimaryButton>}
            </div>
         </div>

         {/* Display an action when the button is clicked */}
         {action && <Action message={"Change theme"} type="theme" color="primary" buttonMessage="Change theme" setAction={setAction} />}
      </>
   );
};

export default ThemeBox;