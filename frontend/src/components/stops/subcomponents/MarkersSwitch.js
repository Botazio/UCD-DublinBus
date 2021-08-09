import FormControlLabel from '@material-ui/core/FormControlLabel';
import PrimarySwitch from '../../../reusable-components/custom-switch/PrimarySwitch';

// This component acts as a button to render the markers
// When active the markers are displayed on the map
const MarkersSwitch = ({ displayMarkers, setDisplayMarkers }) => {
  return (
    <FormControlLabel
      value="start"
      control={<PrimarySwitch checked={displayMarkers} color="primary" onChange={() => handleChange()} />}
      label="Display markers"
      labelPlacement="start"
      style={{ margin: '0px 5px' }}
    />
  );

  function handleChange() {
    if (displayMarkers) {
      setDisplayMarkers(false);
    } else {
      setDisplayMarkers(true);
    }
  }
};

export default MarkersSwitch;
