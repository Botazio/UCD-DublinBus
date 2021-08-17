import ResponseAction from "./subcomponents/ResponseAction";
import SubmitButtonAction from "./subcomponents/SubmitButtonAction";
import { actionFetch } from "../../helpers/utils";
import { useAuth } from "../../providers/AuthContext";

// Component that handles the logic to add new lines to favorites
const ActionAddLines = (props) => {
   // Grab the user from the provider
   const { isAuthenticated } = useAuth();

   return (
      <>
         {/* Submit response messages */}
         <ResponseAction {...props} />

         {/* Submit button */}
         <SubmitButtonAction onClick={() => handleSubmit()} isPending={props.isPending} color="primary">
            Add lines
         </SubmitButtonAction>
      </>
   );

   // Function to submit the info
   async function handleSubmit() {
      // Wait for the fetch calls to finish 
      await Promise.all(
         props.activeLines.map((line) => {
            let body = { "route_short_name": line.route__route_short_name, "direction_id": line.direction_id };

            let response = actionFetch(
               "https://csi420-02-vm6.ucd.ie/favoriteline/",
               "POST",
               body,
               props.setError,
               props.setIsPending,
               props.setOkMessage
            );

            return response;
         }
         ));

      // Update the user 
      isAuthenticated();

      // Set the active lines to an empty array even if the response is not ok
      props.setActiveLines([]);

      // Close the action component after one second 
      setTimeout(() => {
         props.setAction(false);
      }, 1000);
   }
};

export default ActionAddLines;