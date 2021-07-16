import { Marker } from "@react-google-maps/api";
import { useEffect } from "react";

// cutomizable small component that creates a marker and centers the view at that position
const CustomMarker = ({ id, position, iconType, mapRef }) => {
  useEffect(() => {
    // move the map view to the center of the marker
    mapRef.panTo(position);
  }, [position, mapRef]);

  return (
    <Marker
      key={id}
      position={position}
      options={{
        icon: iconType ? iconType : null,
        map: mapRef,
        zIndex: 1000,
      }}
      onClick={() => handleClick()}
    />
  );

  // zoom the view if the user clicks on the marker
  function handleClick() {
    const zoom = mapRef.getZoom();

    // zooms more the higher is the view
    if (zoom <= 13) {
      mapRef.setZoom(zoom + 2);
    } else if (13 < zoom && zoom <= 16) {
      mapRef.setZoom(zoom + 1);
    }

    // pans the view to the marker
    mapRef.panTo(position);
  }
};

export default CustomMarker;
