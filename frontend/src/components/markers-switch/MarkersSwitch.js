import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

// this component acts as a button to render the markers
const MarkersSwitch = ({ displayMarkers, setDisplayMarkers, mapRef }) => {
  return (
    <FormControlLabel
      value="start"
      control={<Switch checked={displayMarkers} color="primary" onChange={() => handleChange()} />}
      label="DisplayMarkers"
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
