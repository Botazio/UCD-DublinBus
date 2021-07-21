import NotFoundText from "./NotFoundText";
import Navbar from "../navbar/NavBar";

// This component renders when the url is not found
// Provides an error message and a link to the front page
const NotFound = () => {
  return (
    <>
      <Navbar />
      <NotFoundText />
    </>
  );
};

export default NotFound;
