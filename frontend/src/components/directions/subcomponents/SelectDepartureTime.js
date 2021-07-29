import Card from "../../../reusable-components/card/Card";
import PopoverOptions from "../../../reusable-components/popover-options/PopoverOptions";
import DirectionsCSS from "../Directions.module.css";
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { useState } from "react";
import PrimaryDatePicker from "../../../reusable-components/custom-datepicker/PrimaryDatePicker";
import PrimaryHourPicker from "../../../reusable-components/custom-hourpicker/PrimaryHourPicker";

const SelectDepartureTime = () => {
   const [active, setActive] = useState("leave now");

   return (
      <Card>
         <div className={DirectionsCSS.select_time_container}>
            <h4>{active}</h4>

            {/* Display a popover */}
            <PopoverOptions icon={<ArrowDropDownRoundedIcon />}>
               <div className={DirectionsCSS.select_time_option} onClick={() => handleClick("leave now")}>
                  <FiberManualRecordIcon fontSize="inherit" htmlColor={(active === "leave now") ? "" : "transparent"} />
                  <p>Leave now</p>
               </div>
               <div className={DirectionsCSS.select_time_option} onClick={() => handleClick("leave at")}>
                  <FiberManualRecordIcon fontSize="inherit" htmlColor={(active === "leave at") ? "" : "transparent"} />
                  <p>Leave at</p>
               </div>
            </PopoverOptions>
         </div>

         {(active === "leave at") &&
            <div className={DirectionsCSS.select_date_hour}>
               <PrimaryDatePicker />
               <PrimaryHourPicker />
            </div>
         }
      </Card>
   );

   function handleClick(text) {
      setActive(text);

   }
};

export default SelectDepartureTime;