import NavbarCSS from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../providers/AuthContext";
import PopoverUser from "../popover-user/PopoverUser";
import { useEffect } from "react";
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import { useTheme } from "@material-ui/core";

const Navbar = () => {
  // Grab the functions and states from the authentication provider
  const { currentUser, logout, isAuthenticated } = useAuth();

  // Grab the theme from the provider
  const theme = useTheme().theme;

  // When the component renders the first time checks if the user
  // has a token in local storage and if that token still valid
  useEffect(() => {
    isAuthenticated();
    // eslint-disable-next-line
  }, []);

  return (
    <nav
      className={NavbarCSS.navbar}
      style={{
        backgroundColor: theme.background_primary,
        color: theme.font_color,
      }}>

      {/* We use this div to insert the list icon */}
      <div id="icon" className={NavbarCSS.custom_icon}></div>

      {/* For phone we display the active section instead of the logo using a portal */}
      <div className={NavbarCSS.navbar_logo}>
        <h2 className={NavbarCSS.logo_navbar_phone} id="logo_navbar_phone">
          {" "}
        </h2>
        <h2 className={NavbarCSS.logo_navbar_desktop} id="logo_navbar_desktop">
          DUBLIN BUS
        </h2>
      </div>

      <div className={NavbarCSS.login_icon}>
        {/* Change the icon logo if there if the user has login*/}
        {!currentUser && (
          <Link to="/login">
            <PersonRoundedIcon htmlColor="black" fontSize="large" />
          </Link>
        )}
        {currentUser && (<PopoverUser logout={logout} />)}
      </div>

    </nav>
  );
};

export default Navbar;
