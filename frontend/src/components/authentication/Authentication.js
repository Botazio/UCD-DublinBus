import { useState } from "react";
import AuthenticationCSS from "./Authentication.module.css";
import { Link } from "react-router-dom";
import SignIn from "./subcomponents/SignIn";
import SignUp from "./subcomponents/SignUp";
import { ReactComponent as Arrow } from "./fixtures/icon-arrow.svg";

const Authentication = () => {
  // state that controls when to display sign in or sign up
  const [signInActive, setSignInActive] = useState(true);

  return (
    <div className={AuthenticationCSS.wrapper}>
      <Link to="/">
        <div className={AuthenticationCSS.back_home_button}>
          <Arrow height={"30px"} fill={"white"} />
        </div>
      </Link>
      <div className={AuthenticationCSS.auth_box}>
        <div className={AuthenticationCSS.toggle_buttons}>
          <div
            onClick={() => setSignInActive(false)}
            className={signInActive ? AuthenticationCSS.inactive : ""}
          >
            <p>Sign up</p>
          </div>
          <div
            onClick={() => setSignInActive(true)}
            className={!signInActive ? AuthenticationCSS.inactive : ""}
          >
            <p>Sign in</p>
          </div>
        </div>
        <div className={AuthenticationCSS.tabs}>
          {signInActive && <SignIn />}
          {!signInActive && <SignUp />}
        </div>
      </div>
    </div>
  );
};

export default Authentication;
