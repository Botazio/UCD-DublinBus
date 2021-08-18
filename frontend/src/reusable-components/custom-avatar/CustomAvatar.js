import { Avatar, useTheme } from "@material-ui/core";
import useFetchAuth from "../../helpers/useFetchAuth";
import { useAuth } from "../../providers/AuthContext";

const CustomAvatar = () => {
   // Grab the current user from the provider
   const { currentUser } = useAuth();

   // Grab the theme from the provider
   const color = useTheme().theme.primary;

   // Get the data from the provider
   const { data, isPending, error } = useFetchAuth("https://csi420-02-vm6.ucd.ie/user_icon/");

   console.log(data);

   return (
      <>
         {(error || isPending) &&
            <Avatar style={{ backgroundColor: color }}>
               {currentUser.username.charAt(0)}
            </Avatar>}
         {data && console.log("hey")}
      </>
   );
};

export default CustomAvatar;