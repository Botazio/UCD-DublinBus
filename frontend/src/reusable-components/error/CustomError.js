import CustomErrorCSS from "./CustomError.module.css";
import { ReactComponent as IconError } from "./fixtures/icon-error.svg";

// This component is displayed when there is an error 
// Can be customized selecting the message, color and height to be displayed
const CustomError = ({ message, color, height, messageSize }) => {
  return (
    <div className={CustomErrorCSS.wrapper}>
      <IconError height={height} fill={color}></IconError>
      <div className={CustomErrorCSS.message} style={{ color: color }}>
        <h3 style={{ fontSize: messageSize }}>{message}</h3>
      </div>
    </div>
  );
};

export default CustomError;
