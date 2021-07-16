import { useState } from "react";
import { useContext } from "react";
import React from "react";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// This components provides a context to share the user across the different components in the application
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  // Error that is used to display a message for the user in the components signin and signup
  const [errorMessage, setErrorMessage] = useState();

  // function to sign up
  function signup(username, password) {
    const body = { username: username, password: password };

    // set the error to null
    setErrorMessage(null);

    fetch("http://csi420-02-vm6.ucd.ie/dublinbus/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error();
        }
        return res.json();
      })
      .then((json) => {
        // set the token in the local storage so it does not depend on react state
        localStorage.setItem("token", json.token);

        // set the current user to the response
        setCurrentUser({ username: json.username });
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("fetch abort");
        } else {
          console.log(err);
          setErrorMessage("Failed to create an account");
        }
      });
  }

  // function to sign in
  function signin(username, password) {
    const body = { username: username, password: password };

    // set the error to null
    setErrorMessage(null);

    fetch("http://csi420-02-vm6.ucd.ie/token-auth/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error();
        }
        return res.json();
      })
      .then((json) => {
        // set the token in the local storage so it does not depend on react state
        localStorage.setItem("token", json.token);

        // set the current user to the response
        setCurrentUser(json.user);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("fetch abort");
        } else {
          setErrorMessage("Failed to sign in");
        }
      });
  }

  // function to check if the user is authenticated
  function isAuthenticated() {
    // if there is a token in the local storage try to log in
    if (localStorage.getItem("token")) {
      fetch("http://csi420-02-vm6.ucd.ie/dublinbus/current_user/", {
        method: "GET",
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          // change this later when they send me back a user object
          // set the current user to the response if the toke is valid
          if (json.username) {
            setCurrentUser({ username: json.username });
          } // logout if the response is not a user
          else {
            logout();
          }
        });
    }
  }

  // function to log out
  function logout() {
    localStorage.removeItem("token");
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    signup,
    signin,
    isAuthenticated,
    logout,
    errorMessage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
