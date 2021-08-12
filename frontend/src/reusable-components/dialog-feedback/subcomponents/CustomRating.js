import { Box, DialogContent } from "@material-ui/core";
import { Rating } from "@material-ui/lab";

// This component renders a material UI rating setting
// it to the correct position
const CustomRating = ({ value, setValue }) => {
   return (
      <DialogContent>
         <Box
            display="flex"
            justifyContent="center"
            alignItems="center">
            <Rating
               name="simple-controlled"
               size="large"
               value={value}
               onChange={(event, newValue) => {
                  setValue(newValue);
               }}
            />
         </Box>
      </DialogContent>
   );
};

export default CustomRating;