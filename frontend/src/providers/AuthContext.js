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

  // function to sign up
  function signup(username, email, password) {
    console.log(username, email, password)

    fetch('http://csi420-02-vm6.ucd.ie/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(username, email, password)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        setCurrentUser(json.user);
      });
  }

  // function to log out
  function logout() {
    localStorage.removeItem('token');
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    signup,
    logout
  }

  return (
    <AuthContext.Provider value={value} >
      {children}
    </AuthContext.Provider>
  )
}