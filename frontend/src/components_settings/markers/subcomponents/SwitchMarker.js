import PrimarySwitch from '../../../reusable-components/custom-switch/PrimarySwitch';
import MarkersCSS from "../Markers.module.css";

const SwitchMarker = ({ title, isActive, handleChange }) => {
   return (
      <div className={MarkersCSS.switch_container}>
         <h4>{title}</h4>
         <PrimarySwitch checked={isActive} onClick={() => handleChange(title, isActive)} />
      </div>
   );
};

export default SwitchMarker;