import AppearenceHeader from "./subcomponents/AppearenceHeader";
import ThemeBox from "./subcomponents/ThemeBox";
import AppearenceCSS from "./Appearence.module.css";


// This component is the main component for the appearence section
// in the settings page
const Profile = () => {
   const preThemeInfo = "Select one of our predefined themes using the buttons down below. See the changes in the box.";
   const cusThemeInfo = "Create your custom theme. Use the color pickers to define your own colors.";

   return (
      <>
         <AppearenceHeader />
         {/* Predifined themes */}
         <div className={AppearenceCSS.theme_wrapper}>
            <ThemeBox title="Predefined themes" info={preThemeInfo} type="predefined" />
            {/* Custom themes */}
            <ThemeBox title="Custom themes" info={cusThemeInfo} type="custom" />
         </div>
      </>
   );
};

export default Profile;