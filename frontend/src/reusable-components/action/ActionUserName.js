import { useState } from "react";
import ResponseAction from "./subcomponents/ResponseAction";
import SubmitButtonAction from "./subcomponents/SubmitButtonAction";
import TextFieldAction from "./subcomponents/TextFieldAction";
import { actionFetch } from "../../helpers/utils";
import { useAuth } from "../../providers/AuthContext";
import { useHistory } from "react-router-dom";

// Component that handles the logic of the submission for changing the username
const ActionUserName = (props) => {
   // States for the input fields
   const [firstField, setFirstField] = useState("");

   // Grab the user from the provider
   const { currentUser, logout } = useAuth();
   // Grab history to redirect the user
   const history = useHistory();

   return (
      <>
         {/* Display a text field */}
         <TextFieldAction value={firstField} setValue={setFirstField} message={"Choose a new name"} />

         {/* Submit response messages */}
         <ResponseAction {...props} />

         {/* Submit button */}
         <SubmitButtonAction onClick={() => handleSubmit()} isPending={props.isPending} color="primary">
            Change username
         </SubmitButtonAction>
      </>
   );

   // Function to submit the info
   async function handleSubmit() {
      // Validate the fields before sending the request to the server
      if (validateSubmit() === false) return;

      // Body to pass to the fetch request
      let body = { "username": firstField };

      // Grab the response from the request
      let response = await actionFetch(
         `https://csi420-02-vm6.ucd.ie/users/${currentUser.pk}/`,
         "PUT",
         body,
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

   // This function validates that the submit is correct
   function validateSubmit() {
      props.setError(null);

      if (firstField === "") {
         props.setError("Field must be filled");
         return false;
      }

      return true;

   }
};

export default ActionUserName;