import Profile from "../profile/Profile";
import Appearence from "../appearence/Appearence";
import InfoBoxCSS from "./InfoBox.module.css";
import Markers from "../markers/Markers";
import Favorites from "../favorites/Favorites";

// Renders a different section depending in which button is active 
const InfoBox = ({ buttonActive }) => {
   return (
      <div className={InfoBoxCSS.infobox}>
         {/* Render a section depending on which one is active */}
         {buttonActive === "profile" && <Profile />}
         {buttonActive === "appearence" && <Appearence />}
         {buttonActive === "favorites" && <Favorites />}
         {buttonActive === "markers" && <Markers />}
      </div>
   );
};

export default InfoBox;