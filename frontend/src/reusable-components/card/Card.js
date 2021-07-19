import CardCSS from './Card.module.css';

// This components creates a wrapper used in the different components for the info bar
// Sets up the background color and the border radius 
const Card = (props) => {
   return (
      <div className={CardCSS.card + " " + CardCSS[props.variant]}>
         {props.children}
      </div>
   );
};

export default Card;