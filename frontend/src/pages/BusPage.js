import NavBar from "../components/navbar/NavBar";
import SideBar from "../components/sidebar/SideBar";
import MapContainer from "../components/mapcontainer/MapContainer";

const BusPage = () => {

   return (
      <>
         <NavBar />
         {/* MapContainer is a context where all the childs can access the map property */}
         <MapContainer>
            <SideBar />
         </MapContainer>
      </>
   );
}

export default BusPage;