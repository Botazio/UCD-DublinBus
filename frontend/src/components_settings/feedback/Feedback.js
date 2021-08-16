import FeedbackForm from "./subcomponents/FeedbackForm";
import FeedbackPreferences from "./subcomponents/FeedbackPreferences";

// This component is the main component for the profile section
// in the settings page
const Feedback = () => {
   return (
      <>
         {/* Form to enter opinions about the about the app */}
         <FeedbackForm />

         {/* Allows the user to habilitate or disabled preferences */}
         <FeedbackPreferences />
      </>
   );
};

export default Feedback;