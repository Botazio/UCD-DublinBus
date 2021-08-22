import { Button } from "@material-ui/core";
import { useState } from "react";
import ActionSendFeedback from "../../../reusable-components/action/ActionSendFeedback";
import ActionWrapper from "../../../reusable-components/action/ActionWrapper";
import CustomTextField from "../../../reusable-components/custom-textfield/CustomTextField";
import SettingsHeader from "../../../reusable-components/settings-header.js/SettingsHeader";

const FeedbackForm = () => {
   // State to control when to display and hide the action message
   const [action, setAction] = useState(false);
   // State to control the value of the text field
   const [value, setValue] = useState('');

   const handleChange = (event) => {
      setValue(event.target.value);
   };

   // Messages to display in the header
   const headerTitle = "Feedback form";
   const headerBody = "Write what you think about the app. Your opinon helps us to improve!";

   return (
      <>
         <SettingsHeader title={headerTitle} body={headerBody} />

         <form autoComplete="off">
            <CustomTextField
               id="outlined-multiline-static"
               multiline
               value={value}
               onChange={handleChange}
               fullWidth
               rows={8}
               variant="outlined"
            />
         </form>

         {/* Display the button to send the form if the text field has any content */}
         {value && <Button
            variant="outlined" style={{ marginTop: "15px" }} color="primary" onClick={() => setAction(true)}>send form
         </Button>}

         {/* Display an action if it is active */}
         {action && <ActionWrapper title={"Send feedback"} setAction={setAction}>
            <ActionSendFeedback question="2" text={value} setValue={setValue} />
         </ActionWrapper>}
      </>
   );
};

export default FeedbackForm;