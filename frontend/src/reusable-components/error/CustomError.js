import { useTheme } from "@material-ui/core";
import CustomErrorCSS from "./CustomError.module.css";
import { ReactComponent as IconError } from "./fixtures/icon-error.svg";

// This component is displayed when there is an error 
// Can be customized selecting the message, color and height to be displayed
const CustomError = ({ message, color, height, messageSize }) => {
  // Grab the theme from the provider
  const theme = useTheme().theme;

  return (
    <div className={CustomErrorCSS.wrapper}>
      <IconError height={height} fill={color ? color : theme.font_color}></IconError>
      <div className={CustomErrorCSS.message} style={color ? { color: color } : { color: theme.font_color }}>
        <h3 style={{ fontSize: messageSize }}>{message}</h3>
      </div>
    </div>
  );
};

export default CustomError;
