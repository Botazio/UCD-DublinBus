import NotfoundCSS from "./Notfound.module.css";
import { Link } from "react-router-dom";

const NotFoundText = () => {
  return (
    <div className={NotfoundCSS.text}>
      <h2>Sorry</h2>
      <p>That page cannot be found</p>
      <Link to="/">Back to the homepage...</Link>
    </div>
  );
};

export default NotFoundText;
