import { Button } from "@material-ui/core";
import { useState } from "react";
import SettingsHeader from "../../reusable-components/settings-header.js/SettingsHeader";

// This component is the main component for the profile section
// in the settings page
const Feedback = () => {
   // State to control when to display and hide the action message
   const [action, setAction] = useState(false);

   // Messages to display in the header
   const headerTitle = "Feedback preferences";
   const headerBody = "Choose here if you want to receive feedback alerts!";

   return (
      <>
         <SettingsHeader title={headerTitle} body={headerBody} />

         <Button
            variant="outlined" color="primary" onClick={() => setAction(true)}>select alerts
         </Button>
      </>
   );
};

export default Feedback;