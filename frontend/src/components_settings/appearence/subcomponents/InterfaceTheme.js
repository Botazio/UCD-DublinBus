import CusThemesButtons from "./CusThemesButtons";
import DisplayThemeBox from "./DisplayThemeBox";
import PreThemesButtons from "./PreThemesButtons";
import { Button, useTheme } from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import ActionTheme from "../../../reusable-components/action/ActionTheme";
import ActionWrapper from "../../../reusable-components/action/ActionWrapper";
import ContentBox from "../../../reusable-components/content-box/ContentBox";


const InterfaceTheme = ({ title, info, type }) => {
   // State to control when to display the action component
   const [action, setAction] = useState(false);
   // State to control the box theme
   const [boxTheme, setBoxTheme] = useState();

   // Grabs the current theme from the provider and set the state of the boxTheme to it 
   // the first time the component renders
   const currentTheme = useTheme();
   useEffect(() => {
      // Take off the owner from the theme as it is not needed
      delete currentTheme.theme.owner;
      setBoxTheme(currentTheme);
   }, [currentTheme]);

   // Do not return anything if there is no box theme 
   if (!boxTheme) return "";

   return (
      <>
         <ContentBox title={title}>
            <p>{info}</p>

            {/* Displays a box theme using the current state colors */}
            <DisplayThemeBox boxTheme={boxTheme} />

            {/* Render predefined buttons or custom buttons depending on the type */}
            {type === "predefined" && <PreThemesButtons boxTheme={boxTheme} setBoxTheme={setBoxTheme} />}
            {type === "custom" && <CusThemesButtons boxTheme={boxTheme} setBoxTheme={setBoxTheme} />}

            {/* Compares the current theme to the box theme if they are not equal render 
               a primary button. This button triggers the action when clicked */}
            {JSON.stringify(currentTheme.theme) !== JSON.stringify(boxTheme.theme) &&
               <Button
                  fullWidth={true} variant="outlined" color="primary" onClick={() => setAction(true)}>change theme
               </Button>}
         </ContentBox>

         {/* Display an action if it is active */}
         {action && <ActionWrapper title={"Change theme"} setAction={setAction}>
            <ActionTheme theme={boxTheme.theme} />
         </ActionWrapper>}
      </>
   );
};

export default InterfaceTheme;