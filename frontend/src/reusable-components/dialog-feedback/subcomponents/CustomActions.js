import { Button, DialogActions } from "@material-ui/core";

// This component provides two options:
// Send feedback to the backend and 
// stop getting dialogs for feedback
const CustomActions = () => {
   return (
      <DialogActions>
         <Button color="primary">
            Don't show again
         </Button>
         <Button color="primary">
            Send
         </Button>
      </DialogActions>
   );
};

export default CustomActions;