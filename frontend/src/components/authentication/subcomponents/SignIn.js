import AuthenticationCSS from "../Authentication.module.css";
import { ReactComponent as Person } from "../fixtures/icon-person.svg";
import { ReactComponent as Lock } from "../fixtures/icon-lock.svg";
import { useAuth } from "../../../providers/AuthContext";
import { useRef, useState } from "react";
import { useEffect } from "react";
import OAuth from "./OAuth";

// This component provides a signin form to login into the application
const SignIn = () => {
  // Reference to the HTML elements
  const usernameRef = useRef();
  const passwordRef = useRef();
  // Hook to get the variables from the authentication context
  const { signin, errorMessage } = useAuth();
  // States for the form. Display error messages and avoids sending the form multiple times
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Uses the error from the context to display a message
  useEffect(() => {
    setError(errorMessage); // Comes from the auth hook after getting an error from the backend
  }, [errorMessage]);

  // Set the error to null the first time the component renders
  useEffect(() => {
    setError(null);
  }, []);

  return (
    <div className={AuthenticationCSS.signin_tab}>
      {/* Google and Facebook buttons */}
      <OAuth />

      {/* If there is an error display it */}
      {error && <div className={AuthenticationCSS.error_wrapper}>{error}</div>}

      {/* Form to fill with email or name and password */}
      <form className={AuthenticationCSS.form} onSubmit={handleSubmit}>
        <div className={AuthenticationCSS.email_wrapper}>
          <div>
            <Person height={"16px"} fill={"#808080"} />
          </div>
          <input
            className={AuthenticationCSS.login_username}
            ref={usernameRef}
            type="text"
            name="username"
            placeholder="Username or Email"
            autoFocus=""
            required=""
          ></input>
        </div>
        <div className={AuthenticationCSS.password_wrapper}>
          <div>
            <Lock height={"16px"} fill={"#808080"} />
          </div>
          <input
            className={AuthenticationCSS.login_password}
            ref={passwordRef}
            type="password"
            name="password"
            placeholder="Password"
            required=""
          ></input>
        </div>
        <button disabled={loading} className={AuthenticationCSS.submit_button}>
          <span>Sign in</span>
        </button>
      </form>
    </div>
  );

  // Function that controls the logic of the form after submission.
  // Uses the context(AuthContext) signin function to change the state of the application 
  // if the response from the backend is ok (the user exist)
  async function handleSubmit(e) {
    e.preventDefault();

    // Error handling
    if (usernameRef.current.value === "") {
      return setError("Username must be filled");
    }
    if (passwordRef.current.value === "") {
      return setError("Email must be filled");
    }

    try {
      setError("");
      // set Loading to true so the user can not send the same information twice
      setLoading(true);
      // try to sign in with the information the user has provided
      // this can triggered an error in the backend if the user does not exist
      signin(usernameRef.current.value, passwordRef.current.value);
    } catch {
      setError("Failed to sign in");
    }
    setLoading(false);
  }
};

export default SignIn;
