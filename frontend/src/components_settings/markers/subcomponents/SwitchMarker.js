import Switch from '@material-ui/core/Switch';
import MarkersCSS from "../Markers.module.css";

const SwitchMarker = ({ title, isActive, handleChange }) => {

   return (
      <div className={MarkersCSS.switch_container}>
         <h4>{title}</h4>
         <Switch checked={isActive} color="primary" onClick={() => handleChange(title, isActive)} />
      </div>
   );
};

export default SwitchMarker;