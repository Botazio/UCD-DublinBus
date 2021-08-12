import ResponseAction from "./subcomponents/ResponseAction";
import SubmitButtonAction from "./subcomponents/SubmitButtonAction";
import { actionFetch } from "../../helpers/utils";
import { useAuth } from "../../providers/AuthContext";

// Component that handles the logic to change the user photo
const ActionPhoto = (props) => {
   // Grab the user from the provider
   const { currentUser, isAuthenticated } = useAuth();

   return (
      <>
         {/* Submit response messages */}
         <ResponseAction {...props} />

         {/* Submit button to add a new photo */}
         <SubmitButtonAction handleSubmit={handleSubmitAdd} isPending={props.isPending} color="primary">
            Upload photo
         </SubmitButtonAction>

         {/* Submit button to delete the current photo */}
         <SubmitButtonAction handleSubmit={handleSubmitDelete} isPending={props.isPending} color="secondary">
            Remove current photo
         </SubmitButtonAction>

      </>
   );

   // Function to submit the info
   async function handleSubmitAdd() {
      // Body to pass to the fetch request
      let body = props.theme;

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
         isAuthenticated();
         setTimeout(() => {
            props.setAction(false);
         }, 1000);
      }
   }
};

export default ActionPhoto;