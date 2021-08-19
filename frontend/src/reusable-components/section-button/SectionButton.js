import { useTheme } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import IconWrapper from "../icon-wrapper/IconWrapper";
import SectionButtonCSS from "./SectionButton.module.css";

const SectionButton = ({ text, icon, buttonActive, ...restProps }) => {
   // State to control if the section is active
   const [active, setActive] = useState(false);

   // Grab the them from the provider
   const theme = useTheme().theme;

   // If the active button is the same as the section
   // that means the section is active
   useEffect(() => {
      if (buttonActive === text) setActive(true);
      else setActive(false);
      // eslint-disable-next-line
   }, [buttonActive]);

   return (
      <div
         style={active ? {
            backgroundColor: theme.background_secondary,
            border: "1px solid " + theme.primary,
         } : {
            backgroundColor: theme.background_primary,
            border: "1px solid " + theme.divider,
         }}
         className={SectionButtonCSS.button}
         value={text}
         {...restProps}
      >
         <IconWrapper active={active}>
            {icon}
         </IconWrapper>
         <p>{text}</p>
      </div>
   );
};

export default SectionButton;