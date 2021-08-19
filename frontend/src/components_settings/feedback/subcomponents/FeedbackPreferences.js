import { Button } from "@material-ui/core";
import { useState } from "react";
import FeedbackCSS from "../Feedback.module.css";
import SettingsHeader from "../../../reusable-components/settings-header.js/SettingsHeader";
import ActionFeedbackAlerts from "../../../reusable-components/action/ActionFeedbackAlerts";
import ActionWrapper from "../../../reusable-components/action/ActionWrapper";
import { useAuth } from "../../../providers/AuthContext";


const FeedbackPreferences = () => {
   // State to control when to display and hide the action message
   const [action, setAction] = useState(false);

   // Grab the user from the provider 
   const { currentUser } = useAuth();

   // Messages to display in the header
   const headerTitle = "Feedback preferences";
   const headerBody = "Choose here if you want to receive feedback alerts!";

   return (
      <>
         <div className={FeedbackCSS.section_wrapper}>
            <SettingsHeader title={headerTitle} body={headerBody} />
            <p>Feedback alerts: {currentUser.allow_feedback ? "on" : "off"}</p> {/* is not defined yet */}

            <Button
               variant="outlined" color="primary" onClick={() => setAction(true)}>select alerts
            </Button>
         </div>

         {/* Display an action if it is active */}
         {action && <ActionWrapper title={"Select alerts"} setAction={setAction}>
            <ActionFeedbackAlerts />
         </ActionWrapper>}
      </>
   );
};

export default FeedbackPreferences;