import { useState } from "react";
import { Link } from "react-router-dom";
import PopoverUserCSS from "./PopoverUser.module.css";
import { ReactComponent as IconPower } from "./fixtures/icon-power.svg";
import Avatar from '@material-ui/core/Avatar';

// This component renders a popover when the user icon is clicked
// Allows the user to logout or to go to the settings page
const PopoverUser = ({ currentUser, logout }) => {
  const [active, setActive] = useState(false);

  return (
    <div className={PopoverUserCSS.wrapper}>
      {/* When the user clicks on the icon it opens or closes the popover */}
      <div className={PopoverUserCSS.pointer} onClick={() => setActive(!active)}>
        <Avatar className={PopoverUserCSS.avatar}>
          {currentUser.username.charAt(0)}
        </Avatar>
      </div>

      {/* Display the popover when the state is active */}
      <div className={PopoverUserCSS.popover + " " + (active ? PopoverUserCSS.popover_active : "")}>
        {/* User avatar, name and link to the user profile */}
        <div className={PopoverUserCSS.popover_header}>
          <Avatar className={PopoverUserCSS.avatar}>
            {currentUser.username.charAt(0)}
          </Avatar>
          <div className={PopoverUserCSS.popover_items}>
            <h4>{currentUser.username}</h4>
            <Link to="/user">
              <button>Edit profile</button>
            </Link>
          </div>
        </div>

        {/* Logout button */}
        <div className={PopoverUserCSS.popover_logout_wrapper}>
          <div onClick={() => logout()}>
            <IconPower height={"15px"} />
            <p>LOGOUT</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PopoverUser;
