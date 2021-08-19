import { Box, DialogContent, DialogTitle } from "@material-ui/core";
import { useState } from "react";
import ResponseAction from "../action/subcomponents/ResponseAction";
import CustomActions from "./subcomponents/CustomActions";
import CustomRating from "./subcomponents/CustomRating";

// This component asks the user for a single rate
const FeedbackDefault = ({ title, ...restProps }) => {
   // State that controls the rating
   const [value, setValue] = useState(null);

   return (
      <>
         {/* Title for the dialog */}
         <DialogTitle>{title}</DialogTitle>

         {/* Rating with stars */}
         <CustomRating value={value} setValue={setValue} />

         {/* Submit response messages */}
         <DialogContent>
            <Box
               display="flex"
               justifyContent="center"
               alignItems="center">
               <ResponseAction {...restProps} />
            </Box>
         </DialogContent>

         {/* Send the rating or cancel being ask for user feedback */}
         <CustomActions rating={value} {...restProps} />
      </>
   );
};

export default FeedbackDefault;