import { Avatar, useTheme } from "@material-ui/core";
import { useEffect } from "react";
import { useAuth } from "../../providers/AuthContext";

const CustomAvatar = (props) => {
   // Grab the current user from the provider
   const { currentUser, userImage, getUserImage } = useAuth();

   // Grab the theme from the provider
   const color = useTheme().theme.primary;

   // Check if there is a user image. In case there is not call the function to get it
   useEffect(() => {
      if (!userImage) getUserImage();
      // eslint-disable-next-line
   }, [userImage]);


   return (
      <>
         <Avatar alt={currentUser.username.charAt(0)} src={userImage} style={{ backgroundColor: color }} {...props}>
            {currentUser.username.charAt(0)}
         </Avatar>
      </>
   );
};

export default CustomAvatar;