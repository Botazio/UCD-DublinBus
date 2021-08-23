import NotfoundCSS from "./Notfound.module.css";
import { Link } from "react-router-dom";
import { useTheme } from "@material-ui/styles";

const NotFoundText = () => {
  // Grab the theme from the provider
  const theme = useTheme().theme;

  return (
    <div className={NotfoundCSS.wrapper} style={{ backgroundColor: theme.background_primary }}>
      <div className={NotfoundCSS.text} style={{ backgroundColor: theme.primary, color: theme.font_color }}>
        <h2>Sorry</h2>
        <p>That page cannot be found</p>
        <Link to="/" style={{ color: theme.font_color }}>Back to the homepage...</Link>
      </div>
    </div>
  );
};

export default NotFoundText;
