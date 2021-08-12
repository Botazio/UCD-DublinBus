import ResponseAction from "./subcomponents/ResponseAction";
import SubmitButtonAction from "./subcomponents/SubmitButtonAction";
import { actionFetch } from "../../helpers/utils";
import { useAuth } from "../../providers/AuthContext";
import { useHistory } from "react-router-dom";

// Component that handles the logic to delete a user account
const ActionDelete = (props) => {
   // Grab the user from the provider
   const { currentUser, logout } = useAuth();
   // Grab history to redirect the user
   const history = useHistory();

   return (
      <>
         {/* Submit response messages */}
         <ResponseAction {...props} />

         {/* Submit button */}
         <SubmitButtonAction onClick={() => handleSubmit()} isPending={props.isPending} color="secondary">
            Delete account
         </SubmitButtonAction>
      </>
   );

   // Function to submit the info
   async function handleSubmit() {
      // Grab the response from the request
      let response = await actionFetch(
         `https://csi420-02-vm6.ucd.ie/users/${currentUser.pk}/`,
         "DELETE",
         "",
         props.setError,
         props.setIsPending,
         props.setOkMessage
      );

      // If the response is ok, logout and send the user to the loging page
      if (response.ok) {
         setTimeout(() => {
            logout();
            history.push("/login");
         }, 1000);
      }
   }
};

export default ActionDelete;