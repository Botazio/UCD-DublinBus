import { Button, DialogActions } from "@material-ui/core";
import { actionFetch } from "../../../helpers/utils";
import { useAuth } from "../../../providers/AuthContext";

// This component provides two options:
// Send feedback to the backend and 
// stop getting dialogs for feedback
const CustomActions = (props) => {
   // Grab the user from the provider
   const { currentUser, isAuthenticated } = useAuth();

   return (
      <DialogActions>
         <Button color="primary" onClick={() => disableAlerts()}>
            Don't show again
         </Button>
         <Button color="primary" onClick={() => handleSubmit()}>
            Send
         </Button>
      </DialogActions>
   );

   // Function to submit the info
   async function handleSubmit() {
      if (!props.rating) return;

      // Body to pass to the fetch request
      let body = { "question": "2", "rating": props.rating };

      // Grab the response from the request
      let response = await actionFetch(
         `https://csi420-02-vm6.ucd.ie/feedback_answer/`,
         "POST",
         body,
         props.setError,
         props.setIsPending,
         props.setOkMessage
      );

      // If the response is ok, update the user state and close the action
      if (response.ok) {
         setTimeout(() => {
            props.setAction(false);
         }, 1000);
      }
   }

   // Function to disable the alerts
   async function disableAlerts() {
      // Body to pass to the fetch request
      let body = { "allow_feedback": "False" };


      // Grab the response from the request
      let response = await actionFetch(
         `https://csi420-02-vm6.ucd.ie/users/${currentUser.pk}/`,
         "PUT",
         body,
         props.setError,
         props.setIsPending,
         props.setOkMessage
      );

      // If the response is ok, update the user state and close the action
      if (response.ok) {
         setTimeout(() => {
            props.setAction(false);
            isAuthenticated();
         }, 1000);
      }
   }

};

export default CustomActions;