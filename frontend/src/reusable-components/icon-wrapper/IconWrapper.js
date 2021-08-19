import { useTheme } from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import { cloneElement } from "react";

// This component render the icons with the correct color
// from the provider.
const IconWrapper = ({ active, children }) => {
   // State to control the icon color
   const [color, setColor] = useState();

   // Grab the theme from the provider
   const theme = useTheme().theme;

   // Display the icon with the primary color if it is active
   useEffect(() => {
      if (active) setColor(theme.primary);
      else setColor(theme.icon_color);
   }, [active, theme]);

   return (
      cloneElement(children, {
         htmlColor: color,
      })
   );
};

export default IconWrapper;