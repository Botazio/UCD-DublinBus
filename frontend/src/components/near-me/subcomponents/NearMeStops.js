import NearMeCSS from "../NearMe.module.css";
import geodist from "geodist";
import Card from "../../../reusable-components/card/Card";
import DisplayStops from "./DisplayStops";
import Pagination from '@material-ui/lab/Pagination';
import { useStops } from "../../../providers/StopsContext";
import Waiting from "../../../reusable-components/waiting/Waiting";
import CustomError from "../../../reusable-components/error/CustomError";
import { useEffect, useState } from "react";


const NearMeStops = ({ position, distance, resultsDisplayed }) => {
   // State to handle the near stops
   const [nearStops, setNearStops] = useState([]);
   // State for the pagination in the results
   const [page, setPage] = useState(1);

   // Get the data from the stops provider
   const { data, isPending, error } = useStops();

   // Look for nearme stops when the component renders and 
   // when distance, data or maxStopsDisplayed change
   useEffect(() => {
      findNearStops(data);
      // eslint-disable-next-line
   }, [data, distance, resultsDisplayed]);

   // function that sets the results page with the new value
   const handlePage = (event, value) => {
      setPage(value);
   };

   // Error handling when fetching for the data
   if (error)
      return <CustomError height="60" message="Unable to fetch the data" />;

   // Wait for the data
   if (isPending) return <Waiting variant="dark" />;

   // If there are no stops around display an error
   if (nearStops === "no stops") {
      return (<CustomError message="No stops around" height={70} />);
   }

   return (
      <Card variant="last">
         {/* Do not display any data if there are not results */}
         {(nearStops !== "no stops") && <DisplayStops stops={nearStops} page={page} />}

         {/* Pagination for the results */}
         {(nearStops !== "no stops") && <div className={NearMeCSS.pagination}>
            <Pagination onChange={handlePage} page={page} count={Math.ceil(nearStops.length / 10)} color="primary" size="small" />
         </div>}
      </Card>
   );

   // Function that searches for near stops 
   function findNearStops(stops) {
      // If there is no data return 
      if (!stops) return;

      // Use geolocation to create an array with the closer stops
      let nearStopsArray = stops.filter((stop) => {
         var dist = geodist({ lat: position.lat, lon: position.lng }, { lat: stop.stop_lat, lon: stop.stop_lon }, { exact: true, unit: 'km' });
         // if the distance is less than the distance set by the user
         // put the value into the array
         if (dist < distance) {
            // set a property in the stop object call distance
            stop.stop_dist = dist;
            return stop;
         }
         else return null;
      });

      // If the array is empty return null and set the state to "no stops"
      if (!nearStopsArray.length) {
         setNearStops("no stops");
         return null;
      }


      // Sort the array by the closest stops using the property we set up before
      nearStopsArray.sort(compare);

      // Display as many stops as the user wants using the resultsDisplayed state
      nearStopsArray = nearStopsArray.slice(0, resultsDisplayed);

      // Set the state with the results
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

export default NearMeStops;