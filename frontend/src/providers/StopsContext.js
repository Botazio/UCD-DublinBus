import { useContext } from "react";
import React from "react";
import useFetch from "../helpers/useFetch";

const StopsContext = React.createContext();

export function useStops() {
   return useContext(StopsContext);
}

// This components provides a context to share the stops across the different components in the application
export function StopsProvider({ children }) {
   // Fetch the data for the lines or for the stops
   const { data, isPending, error } = useFetch("https://csi420-02-vm6.ucd.ie/stops");

   const value = {
      data,
      isPending,
      error
   };

   return <StopsContext.Provider value={value}>{children}</StopsContext.Provider>;
}
