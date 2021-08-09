import { Popover } from '@material-ui/core';
import { useEffect } from 'react';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import AppearenceCSS from "../Appearence.module.css";

// This component renders a popover with a HEX color picker in it
const PopoverColorPicker = ({ type, boxTheme, setBoxTheme }) => {
   // State to handle the color 
   const [color, setColor] = useState("");
   // State to handle the popover
   const [anchorEl, setAnchorEl] = useState(null);

   // First time the component renders it sets the color of the circle
   // to the current theme depending on the type.
   useEffect(() => {
      if (type === "primary") {
         setColor(boxTheme.theme.primary);
      }
      if (type === "background primary") {
         setColor(boxTheme.theme.background_primary);
      }
      if (type === "background secondary") {
         setColor(boxTheme.theme.background_secondary);
      }
      if (type === "divider") {
         setColor(boxTheme.theme.divider);
      }
      if (type === "icons & font color") {
         setColor(boxTheme.theme.icon_color);
      }
      // eslint-disable-next-line
   }, []);

   // Every time color changes it sets the box theme to that color depending on the type.
   // All the other parts of the theme stays the same 
   useEffect(() => {
      if (type === "primary") {
         setBoxTheme({ ...boxTheme, theme: { ...boxTheme.theme, primary: color } });
      }
      if (type === "background primary") {
         setBoxTheme({ ...boxTheme, theme: { ...boxTheme.theme, background_primary: color } });
      }
      if (type === "background secondary") {
         setBoxTheme({ ...boxTheme, theme: { ...boxTheme.theme, background_secondary: color } });
      }
      if (type === "divider") {
         setBoxTheme({ ...boxTheme, theme: { ...boxTheme.theme, divider: color } });
      }
      if (type === "icons & font color") {
         setBoxTheme({ ...boxTheme, theme: { ...boxTheme.theme, icon_color: color } });
         setBoxTheme({ ...boxTheme, theme: { ...boxTheme.theme, font_color: color } });
      }
      // eslint-disable-next-line
   }, [color]);

   // function to handle how the popover opens
   const handlePopoverOpen = (event) => {
      setAnchorEl(event.currentTarget);
   };

   // function to handle how the popover closes
   const handlePopoverClose = () => {
      setAnchorEl(null);
   };

   const open = Boolean(anchorEl);

   return (
      <>
         {/* Open the popover when the options icon is clicked */}
         <div className={AppearenceCSS.cus_themes_button} onClick={handlePopoverOpen} style={{ backgroundColor: color }}></div>

         {/* Material UI standard popover */}
         <Popover
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
               vertical: 'top',
               horizontal: 'center',
            }}
            transformOrigin={{
               vertical: 'bottom',
               horizontal: 'center',
            }}
            onClose={handlePopoverClose}>
            {/* Render the children inside the popover */}
            <div className={AppearenceCSS.cus_themes_popover} style={{ padding: "10px 15px" }}>
               <div><p>{type}</p></div>
               {/* External component color picker */}
               {<HexColorPicker color={color} onChange={setColor} />}
            </div>
         </Popover>
      </>
   );
};

export default PopoverColorPicker;