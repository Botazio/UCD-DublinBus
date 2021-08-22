import { useTheme } from "@material-ui/core";
import { ComboboxPopover } from "@reach/combobox";

const style = (theme) => ({
   border: `1px solid ${theme.primary}`,
   boxShadow: `0 0 0 0.5pt ${theme.primary}`,
   backgroundColor: theme.background_primary,
   color: theme.font_color,
   borderRadius: "5px",
   zIndex: "1000"
}
);

const CustomComboboxPopover = (props) => {
   // Grab the theme from the provider
   const theme = useTheme().theme;

   return (
      <ComboboxPopover
         {...props}
         style={style(theme)}>
      </ComboboxPopover>
   );
};

export default CustomComboboxPopover;