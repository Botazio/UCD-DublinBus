import { Button, useTheme } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import ActionMap from "../../../reusable-components/action/ActionMap";
import ActionWrapper from "../../../reusable-components/action/ActionWrapper";
import ContentBox from "../../../reusable-components/content-box/ContentBox";
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
         <ContentBox title="Map themes">
            <p>Select one of our predefined themes using the buttons down below.</p>

            {/* Mini map to see the different types of maps */}
            <DisplayMapBox boxTheme={boxTheme} />

            {/* Buttons that control the state of the box theme */}
            <MapThemesButtons boxTheme={boxTheme} setBoxTheme={setBoxTheme} />

            {/* Compares the current theme to the box theme */}
            {JSON.stringify(currentTheme.map) !== JSON.stringify(boxTheme.map) &&
               <Button
                  fullWidth={true} variant="outlined" color="primary" onClick={() => setAction(true)}>change theme
               </Button>}
         </ContentBox>

         {/* Display an action if it is active */}
         {action && <ActionWrapper title={"Change map theme"} setAction={setAction}>
            <ActionMap map={boxTheme.map} />
         </ActionWrapper>}
      </>
   );
};

export default MapTheme;