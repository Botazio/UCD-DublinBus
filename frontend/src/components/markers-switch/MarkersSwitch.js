import MarkersSwitchCSS from './MarkersSwitch.module.css';

// this component acts as a button to render the markers
const MarkersSwitch = ({ displayMarkers, setDisplayMarkers }) => {
   return (
      <div className={MarkersSwitchCSS.display_markers_switch} >
         <p>Display markers</p>
         <label className={MarkersSwitchCSS.switch}>
            <input type="checkbox" />
            <span className={MarkersSwitchCSS.slider} onClick={() => handleClick()}></span>
         </label>
      </div>);

   function handleClick() {
      if (displayMarkers) {
         setDisplayMarkers(false);
      }
      else {
         setDisplayMarkers(true);
      }
   }
}

export default MarkersSwitch;