import { useEffect } from "react";
import { useState } from "react";
import NavBar from "../components/navbar/NavBar";
import Settings from "../components_settings/settings/Settings";

const UserPage = () => {
  // State that controls if the navbar has rendered
  // We need to wait for it before rendering the settings so the 
  // portals work correctly
  const [navbarHasRendered, setNavbarHasRendered] = useState(false);

  // Wait for the component to mount before rendering the settings
  useEffect(() => {
    setNavbarHasRendered(true);
  }, []);

  return (
    <>
      <NavBar />
      {navbarHasRendered && <Settings />}
    </>
  );
};

export default UserPage;
