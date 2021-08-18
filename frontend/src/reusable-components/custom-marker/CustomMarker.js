import { Marker, useGoogleMap } from "@react-google-maps/api";

// Cutomizable small component that creates a marker and centers the view at that position
const CustomMarker = ({ id, position, options, ...restProps }) => {
  // Hook to access the map reference
  const mapRef = useGoogleMap();

  // Default options
  const defaultOptions = {
    map: mapRef,
    zIndex: 1000,
  };

  return (
    <Marker
      key={id}
      position={position}
      options={options ? options : defaultOptions} // Use custom options if there are any
      onClick={() => handleClick()}
      {...restProps}
    />
  );

  // Zoom the view if the user clicks on the marker
  function handleClick() {
    const zoom = mapRef.getZoom();

    if (zoom <= 16) {
      mapRef.setZoom(zoom + 1);
    }

    // Pans the view to the marker
    mapRef.panTo(position);
  }
};

export default CustomMarker;
