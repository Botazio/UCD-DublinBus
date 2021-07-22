import Profile from "../profile/Profile";
import Appearence from "../appearence/Appearence";
import InfoBoxCSS from "./InfoBox.module.css";

const InfoBox = ({ buttonActive }) => {
   return (
      <div className={InfoBoxCSS.infobox}>
         {/* Render a section depending on which one is active */}
         {buttonActive === "profile" && <Profile />}
         {buttonActive === "appearence" && <Appearence />}
         {buttonActive === "favorites" && <Profile />}
         {buttonActive === "markers" && <Profile />}
      </div>
   );
};

export default InfoBox;