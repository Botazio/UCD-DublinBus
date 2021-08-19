import ResponseAction from "./subcomponents/ResponseAction";
import SubmitButtonAction from "./subcomponents/SubmitButtonAction";
import { actionFetch, actionFetchMedia } from "../../helpers/utils";
import { useAuth } from "../../providers/AuthContext";
import { useEffect, useState } from "react";

// Component that handles the logic to change the user photo
const ActionPhoto = (props) => {
   // State that controls the selected image 
   const [selectedImage, setSelectedImage] = useState();

   // Grab the user from the provider and the function to update the user image
   const { currentUser, getUserImage } = useAuth();

   // Function to select an image
   const imageSelecterHandler = event => {
      setSelectedImage(event.target.files[0]);
   };

   // useEffect that calls the submit function when the user selects an image
   useEffect(() => {
      if (selectedImage) handleSubmitAdd();
      // eslint-disable-next-line
   }, [selectedImage]);

   return (
      <>
         {/* Submit response messages */}
         <ResponseAction {...props} />

         {/* Submit button to add a new photo */}
         <input
            accept="image/*"
            id="contained-button-file"
            type="file"
            style={{ display: "none" }}
            onChange={imageSelecterHandler}
         />
         <label htmlFor="contained-button-file">
            <SubmitButtonAction isPending={props.isPending} color="primary" component="span">
               Upload photo
            </SubmitButtonAction>
         </label>

         {/* Submit button to delete the current photo */}
         <SubmitButtonAction onClick={() => handleSubmitDelete()} isPending={props.isPending} color="secondary">
            Remove current photo
         </SubmitButtonAction>

      </>
   );

   // Function to submit the info
   async function handleSubmitAdd() {
      // Body to pass to the fetch request
      let body = new FormData();
      body.append('image', selectedImage, selectedImage.name);

      // Grab the response from the request
      let response = await actionFetchMedia(
         `https://csi420-02-vm6.ucd.ie/users/${currentUser.pk}/`,
         "PUT",
         body,
         props.setError,
         props.setIsPending,
         props.setOkMessage
      );

      // If the response is ok, update the user state and close the action
      if (response.ok) {
         getUserImage();
         setTimeout(() => {
            props.setAction(false);
         }, 1000);
      }
   }

   // Function to submit the info
   async function handleSubmitDelete() {
      // Body to pass to the fetch request
      let body = props.theme;

      // Grab the response from the request
      let response = await actionFetch(
         `https://csi420-02-vm6.ucd.ie/user_icon/`,
         "DELETE",
         body,
         props.setError,
         props.setIsPending,
         props.setOkMessage
      );

      // If the response is ok, update the user state and close the action
      if (response.ok) {
         getUserImage();
         setTimeout(() => {
            props.setAction(false);
         }, 1000);
      }
   }
};

export default ActionPhoto;