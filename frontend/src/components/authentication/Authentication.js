import { useState } from "react";
import AuthenticationCSS from "./Authentication.module.css";
import { Link } from "react-router-dom";
import SignIn from "./subcomponents/SignIn";
import SignUp from "./subcomponents/SignUp";
import { ReactComponent as Arrow } from "./fixtures/icon-arrow.svg";
import { useTheme } from "@material-ui/core";

// This is the main component for the authentication page
// Provides a signin and singup forms
const Authentication = () => {
  // State that controls when to display sign in or sign up
  const [signInActive, setSignInActive] = useState(true);

  // Grab the theme from the provider
  const theme = useTheme().theme;

  return (
    <div className={AuthenticationCSS.wrapper}>

      {/* Link to go back into the main page */}
      <Link to="/">
        <div className={AuthenticationCSS.back_home_button}>
          <Arrow height={"30px"} fill={theme.background_primary} />
        </div>
      </Link>

      <div className={AuthenticationCSS.auth_box}>
        {/* Toogle buttons to switch between signin and signup */}
        <div className={AuthenticationCSS.toggle_buttons}>
          <div
            onClick={() => setSignInActive(false)}
            className={signInActive ? AuthenticationCSS.inactive : ""}>
            <p>Sign up</p>
          </div>
          <div
            onClick={() => setSignInActive(true)}
            className={!signInActive ? AuthenticationCSS.inactive : ""}>
            <p>Sign in</p>
          </div>
        </div>
        {/* signin and signup forms */}
        <div className={AuthenticationCSS.tabs}>
          {signInActive && <SignIn />}
          {!signInActive && <SignUp />}
        </div>
      </div>

    </div>
  );
};

export default Authentication;
