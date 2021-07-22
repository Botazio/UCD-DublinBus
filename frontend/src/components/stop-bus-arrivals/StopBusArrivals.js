import useFetch from "../../helpers/useFetch";
import Waiting from "../../reusable-components/waiting/Waiting";
import StopBusArrivalsCSS from "./StopBusArrivals.module.css";

// This component renders the upcoming arrivals for a certain stop
const StopBusArrivals = ({ selectedStop, waitingColor, waitingSize }) => {
  // Fetch the selected stop
  const { data: fetchedStop, isPending, error } = useFetch("http://csi420-02-vm6.ucd.ie/dublinbus/stop/" + selectedStop.stop_id);

  // Error handling when fetching for the data
  if (error) return <div>Unable to get the bus times</div>;

  // Wait for the data
  if (isPending) return <div className={StopBusArrivalsCSS.waiting_wrapper}><Waiting variant={waitingColor} size={waitingSize} /></div>;

  return (
    <>
      {handleTimes()}
    </>
  );

  // Function that orders the arrivals depending on the time
  function handleTimes() {
    // If there is no arrivals
    if (fetchedStop.arrivals.length === 0) {
      return (
        <div className={StopBusArrivalsCSS.arrival_slides}>
          <p>No scheduled buses</p>
        </div>
      );
    }

    // Order the arrivals
    fetchedStop.arrivals.sort(compare);

    // Return an array of HTML elements
    const arrayArrivals = fetchedStop.arrivals.slice(0, 15).map((arrival) => {
      return (
        <div key={arrival.trip_id} className={StopBusArrivalsCSS.arrival_slides}>
          <p>{arrival.route_id}</p>
          <p>
            <b>{arrival.due_in_min} min</b>
          </p>
        </div>
      );
    });

    return arrayArrivals;
  }

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
