import ResponseAction from "./subcomponents/ResponseAction";
import SubmitButtonAction from "./subcomponents/SubmitButtonAction";
import { actionFetch } from "../../helpers/utils";

// Component that handles the logic to change the user photo
const ActionSendFeedback = (props) => {
   return (
      <>
         {/* Submit response messages */}
         <ResponseAction {...props} />

         {/* Submit button */}
         <SubmitButtonAction onClick={() => handleSubmit()} isPending={props.isPending} color="primary">
            Send
         </SubmitButtonAction>
      </>
   );

   // Function to submit the info
   async function handleSubmit() {
      // Body to pass to the fetch request
      let body;
      if (props.question === "1") body = { "question": props.question, "rating": props.rating };
      if (props.question === "2") body = { "question": props.question, "text": props.text };
      if (props.question === "3") body = { "question": props.question, "rating": props.rating, "text": props.text };

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
            props.setValue("");
            props.setAction(false);
         }, 1000);
      }
   }
};

export default ActionSendFeedback;