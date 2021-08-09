import { useContext } from "react";
import React from "react";
import useFetch from "../helpers/useFetch";

const LinesContext = React.createContext();

export function useLines() {
   return useContext(LinesContext);
}

// This components provides a context to share the stops across the different components in the application
export function LinesProvider({ children }) {
   // Fetch the data for the lines or for the stops
   const { data, isPending, error } = useFetch("https://csi420-02-vm6.ucd.ie/lines/");

   const value = {
      data,
      isPending,
      error
   };

   return <LinesContext.Provider value={value}>{children}</LinesContext.Provider>;
}