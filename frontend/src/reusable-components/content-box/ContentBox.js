import { useTheme } from "@material-ui/core";
import ContentBoxCSS from "./ContentBox.module.css";

// This simple component renders a box that is used in
// the settings page to organize content
const ContentBox = ({ title, children }) => {
   // Grab the theme from the provider
   const theme = useTheme().theme;

   return (
      <div className={ContentBoxCSS.box} style={{ border: `1px solid ${theme.divider}` }}>
         {/* Theme box header and info */}
         <div className={ContentBoxCSS.header}
            style={{ borderBottom: `1px solid ${theme.divider}`, backgroundColor: theme.background_secondary }} >
            <h3>{title}</h3>
         </div>
         <div className={ContentBoxCSS.info}>
            {children}
         </div>
      </div>
   );
};

export default ContentBox;