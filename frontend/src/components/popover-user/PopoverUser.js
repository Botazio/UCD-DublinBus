import { useState } from "react";
import { Link } from "react-router-dom";
import PopoverUserCSS from "./PopoverUser.module.css";
import PowerSettingsNewRoundedIcon from '@material-ui/icons/PowerSettingsNewRounded';
import { useLocation } from "react-use";
import { Button, Popover, useTheme } from "@material-ui/core";
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import { useAuth } from "../../providers/AuthContext";
import CustomAvatar from "../../reusable-components/custom-avatar/CustomAvatar";

// This component renders a popover when the user icon is clicked
// Allows the user to logout or to go to the settings page
const PopoverUser = () => {
  // Grab the functions and states from the authentication provider
  const { currentUser, logout } = useAuth();

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

  // Hook that gives us the url of the current page 
  let location = useLocation().pathname;

  return (
    <>
      {/* When the user clicks on the icon it opens or closes the popover */}
      <div className={PopoverUserCSS.pointer} onClick={handlePopoverOpen}>
        <CustomAvatar />
      </div>

      {/* Display the popover when the state is active */}
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
        <div
          className={PopoverUserCSS.popover_wrapper}
          style={{
            backgroundColor: theme.background_primary,
            color: theme.font_color,
            border: `1px solid ${theme.divider}`
          }}>
          {/* User avatar, name and link to the user profile */}
          <div className={PopoverUserCSS.popover_header}>
            <CustomAvatar />
            <div className={PopoverUserCSS.popover_items}>
              <h4>{currentUser.username}</h4>

              {/* Render a different button depending on the url */}
              {location === "/" && <Link to="/user">
                <Button variant="outlined" color="primary" size="small" startIcon={<EditRoundedIcon />}>Edit profile</Button>
              </Link>}
              {location === "/user" && <Link to="/">
                <Button variant="outlined" color="primary" size="small" startIcon={<HomeRoundedIcon />}>Homepage</Button>
              </Link>}

            </div>
          </div>

          {/* Logout button */}
          <div className={PopoverUserCSS.popover_logout_wrapper} style={{ borderTop: `1px solid ${theme.divider}` }}>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              startIcon={<PowerSettingsNewRoundedIcon />}
              fullWidth={true}
              onClick={() => logout()}>Logout</Button>
          </div>
        </div>
      </Popover>
    </>

  );
};

export default PopoverUser;
