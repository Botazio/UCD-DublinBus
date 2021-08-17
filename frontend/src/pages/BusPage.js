import NavBar from "../components/navbar/NavBar";
import SideBar from "../components/sidebar/SideBar";
import MapContainer from "../components/map-container/MapContainer";
import MapCustomButtons from "../components/map-custom-buttons/MapCustomButtons";
import MarkerUserPosition from "../components/marker-user-position/UserGeolocation";
import GoogleMarkers from "../components/google-markers/GoogleMarkers";

const BusPage = () => {
  return (
    <>
      <NavBar />
      {/* MapContainer is a context where all the childs can access the map property */}
      <MapContainer>
        <SideBar />
        <MapCustomButtons />
        <MarkerUserPosition />
        <GoogleMarkers />
      </MapContainer>
    </>
  );
};

export default BusPage;
