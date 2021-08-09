import Navbar from "../../components/navbar/NavBar";
import NotFoundText from "./NotFoundText";

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
