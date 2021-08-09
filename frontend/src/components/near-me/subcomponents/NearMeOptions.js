import NearMeCSS from "../NearMe.module.css";
import PopoverOptions from "../../../reusable-components/popover-options/PopoverOptions";
import Slider from "@material-ui/core/Slider";

const NearMeOptions = ({ distance, setDistance, resultsDisplayed, setResultsDisplayed }) => {

   // function that sets the distance state with the new value
   const handleRange = (event, newValue) => {
      setDistance(newValue);
   };

   // function that sets the maximum number of results with the new value
   const handleResultsDisplayed = (event, newValue) => {
      setResultsDisplayed(newValue);
   };

   return (
      /* Popover options */
      <div className={NearMeCSS.options}>
         <PopoverOptions>
            <p>Maximum range (km)</p>
            <Slider
               value={distance}
               onChange={handleRange}
               aria-labelledby="discrete-slider-custom"
               valueLabelDisplay="auto"
               min={1}
               max={10}
            />
            <p>Number stops displayed</p>
            <Slider
               value={resultsDisplayed}
               onChange={handleResultsDisplayed}
               aria-labelledby="discrete-slider-custom"
               valueLabelDisplay="auto"
               max={100}
            />
         </PopoverOptions>
      </div>
   );
};

export default NearMeOptions;