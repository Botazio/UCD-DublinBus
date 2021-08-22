import { useTheme } from '@material-ui/core';
import CardCSS from './Card.module.css';

// This components creates a wrapper used in the different components for the info bar
// Sets up the background color and the border radius 
const Card = ({ children, variant, ...restProps }) => {

   // Grab the theme from the provider 
   const theme = useTheme().theme;

   return (
      <div className={CardCSS.card + " " + CardCSS[variant]} {...restProps}
         style={{ border: `1px solid ${theme.divider}`, backgroundColor: theme.background_primary }}>
         {children}
      </div>
   );
};

export default Card;