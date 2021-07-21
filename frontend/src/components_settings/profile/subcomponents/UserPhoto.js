import { Avatar, Button } from "@material-ui/core";
import { useAuth } from "../../../providers/AuthContext";
import ProfileCSS from "../Profile.module.css";

const UserPhoto = () => {
   const { currentUser } = useAuth();

   return (
      <div className={ProfileCSS.avatar_wrapper}>
         <Avatar className={ProfileCSS.avatar}>
            {currentUser.username.charAt(0)}
         </Avatar>
         <div className={ProfileCSS.avatar_header}>
            <h3>{currentUser.username}</h3>
            <Button variant="outlined" color="primary" size="small" >
               change profile photo
            </Button>
         </div>
      </div>
   );
};

export default UserPhoto;