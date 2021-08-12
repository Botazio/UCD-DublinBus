import { DialogTitle } from "@material-ui/core";
import { useState } from "react";
import CustomActions from "./subcomponents/CustomActions";
import CustomRating from "./subcomponents/CustomRating";

// This component asks the user for a single rate
const FeedbackDefault = ({ title }) => {
   // State that controls the rating
   const [value, setValue] = useState(null);

   return (
      <>
         {/* Title for the dialog */}
         <DialogTitle>{title}</DialogTitle>

         {/* Rating with stars */}
         <CustomRating value={value} setValue={setValue} />

         {/* Send the rating or cancel being ask for user feedback */}
         <CustomActions />

      </>
   );
};

export default FeedbackDefault;