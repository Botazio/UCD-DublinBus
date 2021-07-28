import { useTheme } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import Action from "../../../reusable-components/action/Action";
import PrimaryButton from "../../../reusable-components/custom-buttons/PrimaryButton";
import AppearenceCSS from "../Appearence.module.css";
import DisplayMapBox from "./DisplayMapBox";
import MapThemesButtons from "./MapThemesButtons";

// Defines how the map looks offering the user to select between predefined options
const MapTheme = () => {
   // Controls when to display the action message
   const [action, setAction] = useState(false);
   // State to control the theme in the boxTheme
   const [boxTheme, setBoxTheme] = useState();

   // Calls the current theme and set the boxTheme to the current theme the first time
   // the component renders
   const currentTheme = useTheme();
   useEffect(() => {
      setBoxTheme(currentTheme);
   }, [currentTheme]);

   // Do not return anything if there is no boxTheme 
   if (!boxTheme) return "";

   return (
      <>
         <div className={AppearenceCSS.theme_box}>
            <div className={AppearenceCSS.theme_header}>
               <h3>Map themes</h3>
            </div>
            <div className={AppearenceCSS.theme_info}>
               <p>Select one of our predefined themes using the buttons down below.</p>

               {/* Mini map to see the different types of maps */}
               <DisplayMapBox boxTheme={boxTheme} />

               {/* Buttons that control the state of the box theme */}
               <MapThemesButtons boxTheme={boxTheme} setBoxTheme={setBoxTheme} />

               {/* Compares the current theme to the box theme */}
               {JSON.stringify(currentTheme.map) !== JSON.stringify(boxTheme.map) &&
                  <PrimaryButton
                     onClick={() => setAction(true)}>change theme
                  </PrimaryButton>}
            </div>
         </div>

         {/* Display an action if it is active */}
         {action && <Action message={"Change map theme"} type="theme" color="primary" buttonMessage="Change map" setAction={setAction} handleSubmit={handleSubmit} />}
      </>
   );

   // This function is called by the action subcomponent 
   function handleSubmit(user, setCurrentUser) {
      setCurrentUser({ ...user, map: boxTheme.map });
      setAction(false);
   }
};

export default MapTheme;