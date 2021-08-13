import { Button } from "@material-ui/core";
import ActionCSS from "../Action.module.css";

const SubmitButtonAction = ({ isPending, color, children, ...restProps }) => {
   return (
      <div className={ActionCSS.action_submit}>
         <Button disabled={isPending ? true : false} {...restProps} variant="contained" color={color} fullWidth={true}>
            {children}
         </Button>
      </div>
   );
};

export default SubmitButtonAction;