import { CircularProgress } from "@material-ui/core";
import WaitingCSS from "./Waiting.module.css";

// This reusable component is meant to be used while the user is waiting for an async operation
const Waiting = ({ size, thickness, ...restProps }) => {

  return (
    <div className={WaitingCSS.wrapper}>
      <CircularProgress size={size} thickness={thickness} {...restProps} />
    </div>
  );
};

export default Waiting;
