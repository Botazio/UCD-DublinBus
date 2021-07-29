import DirectionsSearcher from "./subcomponents/DirectionsSearcher";

// This component is the main component for the directions section.
// The subcomponents are called from this component
const Directions = () => {
  // This state controls if a line has been selected before displaying
  // the search bars
  const [activeLine, setActiveLine] = useState(null);
  return (
    <>
      {activeLine && <DirectionsSearcher />}
    </>
  );
};

export default Directions;
