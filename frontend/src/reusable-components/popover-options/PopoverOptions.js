import { ReactComponent as IconOptions } from "../../fixtures/icons/icon-options.svg";
import Popover from "@material-ui/core/Popover";
import { useState } from 'react';

// This component displays a popover use to set up the options in the different sections
// It acts as a wrapper 
const PopoverOptions = (props) => {
   // State to handle the popover
   const [anchorEl, setAnchorEl] = useState(null);

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
         <IconOptions height={20} width={20} fill={'black'} onClick={handlePopoverOpen} />
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
            <div style={{ padding: "10px 15px" }}>{props.children}</div>
         </Popover>
      </>
   );
};

export default PopoverOptions;