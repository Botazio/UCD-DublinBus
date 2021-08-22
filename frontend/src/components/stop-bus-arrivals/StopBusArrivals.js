import { useTheme } from "@material-ui/core";
import { useState } from "react";
import useFetch from "../../helpers/useFetch";
import Waiting from "../../reusable-components/waiting/Waiting";
import StopBusArrivalsCSS from "./StopBusArrivals.module.css";
import PrimaryPagination from "../../reusable-components/custom-pagination/PrimaryPagination";

// This component renders the upcoming arrivals for a certain stop
const StopBusArrivals = ({ selectedStop, size, thickness }) => {
  // State for the pagination in the results
  const [page, setPage] = useState(1);

  // Fetch the selected stop
  const { data: fetchedStop, isPending, error } = useFetch("https://csi420-02-vm6.ucd.ie/stop/" + selectedStop.stop_id);

  // Grab the current theme from the provider 
  const theme = useTheme().theme;

  // function that sets the results page with the new value
  const handlePage = (event, value) => {
    setPage(value);
  };

  // Error handling when fetching for the data
  if (error) return <p>Unable to get the bus times</p>;

  // Wait for the data
  if (isPending) return <div className={StopBusArrivalsCSS.waiting_wrapper}><Waiting size={size} thickness={thickness} /></div>;

  return (
    <>
      {/* If there is no arrivals */}
      {(fetchedStop.arrivals.length === 0) && <div className={StopBusArrivalsCSS.arrival_slides}>
        <p>No scheduled buses</p>
      </div>}

      {/* If there is arrivals */}
      {(fetchedStop.arrivals.length > 0) && fetchedStop.arrivals.sort(compare) &&
        fetchedStop.arrivals.slice((page - 1) * 10, ((page - 1) * 10) + 10).map((arrival) => {
          return (
            <div key={arrival.trip_id} className={StopBusArrivalsCSS.arrival_slides}>
              <div>
                <p><b>Line {arrival.line}</b></p>
                <p>{arrival.final_destination_stop_name}</p>
              </div>
              <div>
                <p style={{ color: theme.primary }}><b>{arrival.due_in_min} min</b></p>
              </div>
            </div>
          );
        })}

      {/* Pagination to control the number of results displayed */}
      {(fetchedStop.arrivals.length > 0) &&
        <div className={StopBusArrivalsCSS.pagination}>
          <PrimaryPagination onChange={handlePage} page={page} count={Math.ceil(fetchedStop.arrivals.length / 10)} color="primary" size="small" />
        </div>}
    </>
  );

  // Function that compares the values to perform the sort
  function compare(a, b) {
    if (a.due_in_min < b.due_in_min) {
      return -1;
    }
    if (a.due_in_min > b.due_in_min) {
      return 1;
    }
    return 0;
  }
};

export default StopBusArrivals;
