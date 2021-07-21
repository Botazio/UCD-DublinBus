import DeleteAccount from "./subcomponents/DeleteAccount";
import UserMail from "./subcomponents/UserMail";
import UserName from "./subcomponents/UserName";
import UserPhoto from "./subcomponents/UserPhoto";


// This component is the main component for the profile section
// in the settings page
const Profile = () => {
   return (
      <>
         <UserPhoto />
         <UserName />
         <UserMail />
         <DeleteAccount />
      </>
   );
};

export default Profile;