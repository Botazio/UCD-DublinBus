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
  // User image
  const [userImage, setUserImage] = useState();

  // Function to sign up
  async function signup(username, email, password) {
    const body = { username: username, email: email, password: password };

    // Set the error to null
    setErrorMessage(null);

    // Await for the response
    const res = await fetch("https://csi420-02-vm6.ucd.ie/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // If the response is not ok set the error message
    if (!res.ok) {
      try {
        const error = await res.json();
        if (error) {
          setErrorMessage(error[Object.keys(error)[0]]);
        }
      }
      catch {
        setErrorMessage("Failed to create an account");
      }
    }

    // If the response is ok, set the token in local storage and the current
    // user to the response 
    if (res.ok) {
      const json = await res.json();
      localStorage.setItem("token", json.token);
      setCurrentUser(json);
    }
  }

  // Function to sign in
  async function signin(username, password) {
    const body = { username: username, password: password };

    // set the error to null
    setErrorMessage(null);

    const res = await fetch("https://csi420-02-vm6.ucd.ie/token-auth/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // If the response is not ok set the error message
    if (!res.ok) {
      try {
        const error = await res.json();
        if (error) {
          setErrorMessage(error[Object.keys(error)[0]]);
        }
      }
      catch {
        setErrorMessage("Failed to sign in");
      }
    }

    // If the response is ok, set the token in local storage and the current
    // user to the response 
    if (res.ok) {
      const json = await res.json();
      localStorage.setItem("token", json.token);
      setCurrentUser(json);
    }
  }

  // function to check if the user is authenticated
  function isAuthenticated() {
    // if there is a token in the local storage try to log in
    if (localStorage.getItem("token")) {
      fetch("https://csi420-02-vm6.ucd.ie/users/", {
        method: "GET",
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          // set the current user to the response if the token is valid        
          if (json.username) {
            setCurrentUser(json);
          } else {
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

  // function to login with google and facebook
  async function signinOAuth(company, token) {
    const body = { "auth_token": token };

    // set the error to null
    setErrorMessage(null);

    const res = await fetch(`https://csi420-02-vm6.ucd.ie/${company}/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    });

    // If the response is not ok set the error message
    if (!res.ok) {
      try {
        const error = await res.json();
        if (error) {
          setErrorMessage(error[Object.keys(error)[0]]);
        }
      }
      catch {
        setErrorMessage("Failed to sign in using " + company);
      }
    }

    // If the response is ok, set the token in local storage and the current
    // user to the response 
    if (res.ok) {
      const json = await res.json();
      localStorage.setItem("token", json.token);
      setCurrentUser(json);
    }
  }

  // function to get the user image
  function getUserImage() {
    fetch("https://csi420-02-vm6.ucd.ie/user_icon/", {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`
      },
      method: "GET"
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("could not fetch the data for that resource");
        }
        return res.blob();
      })
      .then((data) => {
        // Return if we get Andrew image
        if (data.size === 3534) {
          setUserImage("default");
          return;
        }
        const objectURL = URL.createObjectURL(data);
        setUserImage(objectURL);
      })
      .catch(() => {
        setUserImage(null);
      });
  }


  const value = {
    currentUser,
    setCurrentUser,
    signup,
    signin,
    signinOAuth,
    userImage,
    getUserImage,
    isAuthenticated,
    logout,
    errorMessage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
