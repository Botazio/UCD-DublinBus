import NearMeCSS from "../NearMe.module.css";
import PopoverOptions from "../../../reusable-components/popover-options/PopoverOptions";
import PrimarySlider from "../../../reusable-components/custom-slider/PrimarySlider";

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
            <PrimarySlider
               value={distance}
               onChange={handleRange}
               aria-labelledby="discrete-slider-custom"
               valueLabelDisplay="auto"
               min={1}
               max={10}
            />
            <p>Number stops displayed</p>
            <PrimarySlider
               value={resultsDisplayed}
               onChange={handleResultsDisplayed}
               aria-labelledby="discrete-slider-custom"
               valueLabelDisplay="auto"
               max={100}
               min={1}
            />
         </PopoverOptions>
      </div>
   );
};

export default NearMeOptions;