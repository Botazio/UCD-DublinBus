import { ReactComponent as IconOptions } from "../../fixtures/icons/icon-options.svg";
import Popover from "@material-ui/core/Popover";
import { useState } from 'react';
import { useTheme } from "@material-ui/core";

// This component displays a popover use to set up the options in the different sections
// It acts as a wrapper 
const PopoverOptions = ({ children, icon }) => {
   // State to handle the popover
   const [anchorEl, setAnchorEl] = useState(null);

   // Grab the theme from the provider
   const theme = useTheme().theme;

   // State to handle how the popover opens
   const handlePopoverOpen = (event) => {
      setAnchorEl(event.currentTarget);
   };

   // State to handle how the popover closes
   const handlePopoverClose = () => {
      setAnchorEl(null);
   };

   const open = Boolean(anchorEl);

   return (
      <>
         {/* Open the popover when the options icon is clicked */}
         <div onClick={handlePopoverOpen} style={{ cursor: "pointer" }}>
            {!icon && <IconOptions height={20} width={20} fill={theme.icon_color} />}
            {icon && icon}
         </div>

         <Popover
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
               vertical: 'bottom',
               horizontal: 'center',
            }}
            transformOrigin={{
               vertical: 'top',
               horizontal: 'right',
            }}
            onClose={handlePopoverClose}>
            {/* Render the children inside the popover */}
            <div
               style={{
                  padding: "15px",
                  borderRadius: "5px",
                  backgroundColor: theme.background_primary,
                  color: theme.font_color,
                  border: `1px solid ${theme.divider}`
               }}>
               {children}
            </div>
         </Popover>
      </>
   );
};

export default PopoverOptions;