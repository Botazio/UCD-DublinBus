import { useGoogleMap } from "@react-google-maps/api";
import { useEffect } from "react";
import { useState } from "react";
import NearMeCSS from "./NearMe.module.css";
import ToogleButtons from "./subcomponents/ToogleButtons";
import Waiting from "../waiting/Waiting";
import FetchError from "../fetch-error/FetchError";
import geodist from "geodist";
import Card from "../../reusable-components/card/Card";
import DisplayStops from "./subcomponents/DisplayStops";
import PopoverOptions from "../popover-options/PopoverOptions";
import Slider from "@material-ui/core/Slider";
import Pagination from '@material-ui/lab/Pagination';
import MarkerUserPosition from "../custom-marker/MarkerUserPosition";
import { useStops } from "../../providers/StopsContext";

// this is the main component for the NearMe section
const NearMe = () => {
   const [active, setActive] = useState('stops');
   const [position, setPosition] = useState(false);
   const [nearStops, setNearStops] = useState([]);
   // states that the user decides on the settings popover
   const [distance, setDistance] = useState(1);
   const [maxStopsDisplayed, setMaxStopsDisplayed] = useState(20);
   // state for the pagination
   const [page, setPage] = useState(1);

   const mapRef = useGoogleMap();

   // Get the data from the provider
   const { data, isPending, error } = useStops();

   useEffect(() => {
      getUserPosition();
      // eslint-disable-next-line
   }, []);

   useEffect(() => {
      findNearStops(data);
      // eslint-disable-next-line
   }, [data, distance, maxStopsDisplayed]);

   const handleRange = (event, newValue) => {
      setDistance(newValue);
   };

   const handleStopsDisplayed = (event, newValue) => {
      setMaxStopsDisplayed(newValue);
   };

   const handlePage = (event, value) => {
      setPage(value);
   };

   // Error handling when fetching for the data
   if (error)
      return <FetchError height="60" message="Unable to fetch the data" />;

   // Wait for the data
   if (isPending) return <Waiting />;

   return (
      <>
         <ToogleButtons active={active} setActive={setActive} />
         <div className={NearMeCSS.options}>
            <PopoverOptions>
               <p>Maximum range (km)</p>
               <Slider
                  value={distance}
                  onChange={handleRange}
                  aria-labelledby="discrete-slider-custom"
                  valueLabelDisplay="auto"
                  max={10}
               />
               <p>Number stops displayed</p>
               <Slider
                  value={maxStopsDisplayed}
                  onChange={handleStopsDisplayed}
                  aria-labelledby="discrete-slider-custom"
                  valueLabelDisplay="auto"
                  max={100}
               />
            </PopoverOptions>
         </div>

         {/* display a marker at the user position*/}
         {position && <MarkerUserPosition
            id="user-position"
            position={position}
            mapRef={mapRef}
         />}

         {(active === "stops") &&
            <Card variant="last">
               <DisplayStops stops={nearStops} mapRef={mapRef} page={page} />

               {/* Controls which stops to display in the infobar from 10 to */}
               {(nearStops !== "no stops") && <div className={NearMeCSS.pagination}>
                  <Pagination onChange={handlePage} page={page} count={Math.ceil(nearStops.length / 10)} color="primary" size="small" />
               </div>}
            </Card>}
      </>
   );

   function getUserPosition() {
      if (!navigator.geolocation) {
         alert("Geolocation is not supported by your browser");
         return;
      }

      navigator.geolocation.getCurrentPosition(
         (pos) => {
            setPosition({
               lat: pos.coords.latitude,
               lng: pos.coords.longitude,
            });
         },
         (err) => alert(err.message)
      );
   }

   function findNearStops(stops) {
      if (!stops) return;

      let nearStopsArray = stops.filter((stop) => {
         var dist = geodist({ lat: position.lat, lon: position.lng }, { lat: stop.stop_lat, lon: stop.stop_lon }, { exact: true, unit: 'km' });
         // if the distance is less than the distance set by the user
         if (dist < distance) {
            // set a property in the stop object call distance
            stop.stop_dist = dist;
            return stop;
         }
         else return null;
      });

      // if the array is empty return a string
      if (!nearStopsArray.length) {
         setNearStops("no stops");
         return null;
      }


      // sort the array by the closest stops
      nearStopsArray.sort(compare);
      // display as many stops as the user wants
      nearStopsArray = nearStopsArray.slice(0, maxStopsDisplayed);

      setNearStops(nearStopsArray);
   }

   // Function that compares the values to perform the sort
   function compare(a, b) {
      if (a.stop_dist < b.stop_dist) {
         return -1;
      }
      if (a.stop_dist > b.stop_dist) {
         return 1;
      }
      return 0;
   }
};

export default NearMe;