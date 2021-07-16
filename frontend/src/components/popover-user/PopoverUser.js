import { useState } from "react";
import { Link } from "react-router-dom";
import PopoverUserCSS from "./PopoverUser.module.css";
import { ReactComponent as Power } from "./fixtures/icon-power.svg";

const PopoverUser = ({ currentUser, logout }) => {
  const [active, setActive] = useState(false);

  return (
    <div className={PopoverUserCSS.wrapper}>
      {/* When the user clicks on the icon it opens or closes the popover */}
      <div
        className={PopoverUserCSS.icon + " " + PopoverUserCSS.pointer}
        onClick={() => setActive(!active)}
      >
        <span className={PopoverUserCSS.noselect} unselectable="on">
          {currentUser.username.charAt(0)}
        </span>
      </div>

      <div
        className={
          PopoverUserCSS.popover +
          " " +
          (active ? PopoverUserCSS.popover_active : "")
        }
      >
        <div className={PopoverUserCSS.popover_header}>
          <div className={PopoverUserCSS.icon}>
            <span className={PopoverUserCSS.noselect} unselectable="on">
              {currentUser.username.charAt(0)}
            </span>
          </div>
          <div className={PopoverUserCSS.popover_items}>
            <h4>{currentUser.username}</h4>
            <Link to="/user">
              <button>Edit profile</button>
            </Link>
          </div>
        </div>
        <div className={PopoverUserCSS.popover_logout_wrapper}>
          <div onClick={() => logout()}>
            <Power height={"15px"} />
            <p>LOGOUT</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopoverUser;
