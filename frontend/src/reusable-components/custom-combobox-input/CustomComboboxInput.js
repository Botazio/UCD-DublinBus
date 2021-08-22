import { useTheme } from "@material-ui/core";
import { ComboboxInput } from "@reach/combobox";
import { useState } from "react";

const style = (theme, margin) => ({
   active: {
      border: `1px solid ${theme.primary}`,
      backgroundColor: theme.background_primary,
      color: theme.font_color,
      boxShadow: `0 0 0 0.5pt ${theme.primary}`,
      padding: "10px 10px",
      width: "100%",
      borderRadius: "25px",
      textDecoration: "none",
      outline: "none",
      fontSize: "1rem",
      marginBottom: (margin ? margin : "15px"),
      textOverflow: "ellipsis",
   },
   inactive: {
      border: `1px solid ${theme.divider}`,
      backgroundColor: theme.background_primary,
      color: theme.font_color,
      padding: "10px 10px",
      width: "100%",
      borderRadius: "25px",
      textDecoration: "none",
      outline: "none",
      fontSize: "1rem",
      marginBottom: (margin ? margin : "15px"),
      textOverflow: "ellipsis",
   }
}
);

const CustomComboboxInput = ({ margin, ...restProps }) => {
   const [active, setActive] = useState(false);
   // Grab the theme from the provider
   const theme = useTheme().theme;

   return (
      <ComboboxInput
         {...restProps}
         style={active ? style(theme, margin).active : style(theme, margin).inactive}
         onFocus={() => setActive(true)}
         onBlur={() => setActive(false)}>
      </ComboboxInput>
   );
};

export default CustomComboboxInput;