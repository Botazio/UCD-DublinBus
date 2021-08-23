import Card from "../../../reusable-components/card/Card";
import PopoverOptions from "../../../reusable-components/popover-options/PopoverOptions";
import PlannerCSS from "../Planner.module.css";
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { useState } from "react";
import PrimaryDatePicker from "../../../reusable-components/custom-datepicker/PrimaryDatePicker";
import PrimaryHourPicker from "../../../reusable-components/custom-hourpicker/PrimaryHourPicker";
import { useEffect } from "react";

const SelectDepartureTime = ({ selectedDate, setSelectedDate, selectedHour, setSelectedHour }) => {
   const [active, setActive] = useState("leave now");

   // Set the time to the current hour every time leave now is set to active
   useEffect(() => {
      if (active === "leave now") {
         setSelectedDate(new Date());
         setSelectedHour(new Date());
      }
      // eslint-disable-next-line
   }, [active]);

   return (
      <Card>
         <div className={PlannerCSS.select_time_container}>
            <h4>{active}</h4>

            {/* Display a popover */}
            <PopoverOptions icon={<ArrowDropDownRoundedIcon />}>
               <div
                  className={PlannerCSS.select_time_option}
                  onClick={() => handleClick("leave now")}>
                  <FiberManualRecordIcon fontSize="inherit" htmlColor={(active === "leave now") ? "" : "transparent"} />
                  <p>Leave now</p>
               </div>
               <div
                  className={PlannerCSS.select_time_option}
                  onClick={() => handleClick("leave at")}>
                  <FiberManualRecordIcon fontSize="inherit" htmlColor={(active === "leave at") ? "" : "transparent"} />
                  <p>Leave at</p>
               </div>
            </PopoverOptions>
         </div>

         {/* If "leave at" is active display the time and hour pickers */}
         {(active === "leave at") &&
            <div className={PlannerCSS.select_date_hour}>
               <PrimaryDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
               <PrimaryHourPicker selectedHour={selectedHour} setSelectedHour={setSelectedHour} />
            </div>
         }
      </Card>
   );

   // Function to change the state of active
   function handleClick(text) {
      setActive(text);
   }
};

export default SelectDepartureTime;