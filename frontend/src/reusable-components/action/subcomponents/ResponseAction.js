import { Alert } from "@material-ui/lab";
import Waiting from "../../waiting/Waiting";
import ActionCSS from "../Action.module.css";

// This component handles the status after submit the action
const ResponseAction = ({ error, isPending, OkMessage }) => {
   return (
      <>
         {/* Messages displayed to the user after the action is submitted */}
         {error && <div className={ActionCSS.message}><Alert severity="error">{error}</Alert></div>}
         {isPending && <div className={ActionCSS.message}><Waiting size={50} thickness={3} /></div>}
         {OkMessage && <div className={ActionCSS.message}><Alert severity="success">Action successful</Alert></div>}
      </>
   );
};

export default ResponseAction;