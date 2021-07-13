import { ReactComponent as Options } from "../../fixtures/icon-options.svg";
import Popover from "@material-ui/core/Popover";
import { useState } from 'react';

// This component displays a popover use for the set up the options in the different sections
const PopoverOptions = (props) => {
   // state to handle the popover
   const [anchorEl, setAnchorEl] = useState(null);

   const handlePopoverOpen = (event) => {
      setAnchorEl(event.currentTarget);
   };

   const handlePopoverClose = () => {
      setAnchorEl(null);
   };

   const open = Boolean(anchorEl);

   return (
      <>
         <Options height={20} width={20} fill={'black'} onClick={handlePopoverOpen} />
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
            <div style={{ padding: "10px 15px" }}>{props.children}</div>
         </Popover>
      </>
   );
};

export default PopoverOptions;