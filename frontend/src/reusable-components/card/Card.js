import CardCSS from './Card.module.css';

// This components creates a wrapper used in the different components for the info bar
// Sets up the background color and the border radius 
const Card = ({ children, variant, ...restProps }) => {
   return (
      <div className={CardCSS.card + " " + CardCSS[variant]} {...restProps}>
         {children}
      </div>
   );
};

export default Card;