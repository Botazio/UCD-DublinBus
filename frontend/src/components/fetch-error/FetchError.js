import FetchErrorCSS from './FetchError.module.css';
import { ReactComponent as Error } from './fixtures/icon-error.svg';

// This component is display when there is an error fetching the data
const FetchError = ({ message, color, height }) => {
   return (
      <div className={FetchErrorCSS.wrapper}>
         <Error height={height} fill={color}></Error>
         <div className={FetchErrorCSS.message} style={{ color: color }}>
            <h3>{message}</h3>
         </div>
      </div>
   );
}

export default FetchError;