import Card from "../../../reusable-components/card/Card";
import LinesCSS from "../Lines.module.css";
import ScheduleIconRoundedIcon from '@material-ui/icons/ScheduleRounded';
import { useTheme } from "@material-ui/core";

const LineBox = ({ line, variant, active, ...restProps }) => {
   // Grab the theme from the provider
   const theme = useTheme().theme;

   return (
      <Card variant={variant ? variant : "last"} {...restProps} style={active ? { backgroundColor: "#0094EC20" } : {}}>
         <div className={LinesCSS.line_title}>
            <div>
               <h4>Line {line.route__route_short_name}</h4>
               <p>{line.trip_headsign}</p>
            </div>
            <a href={"https://dublinbus.ie/Your-Journey1/Timetables/All-Timetables/" +
               staticTimetable[line.route__route_short_name]}
               target="_blank" rel="noreferrer"><ScheduleIconRoundedIcon htmlColor={theme.icon_color} /></a>
         </div>
      </Card>
   );
};

// Mapping from route name to URL for Dublin Bus Timetable
// Need this mapping because Dublin Bus does not use
// predictable names for their URLs
// (e.g., Route 25x maps to 25x3111/)
const staticTimetable = {
   "1": "113/",
   "4": "4/",
   "7": "7-/",
   "7a": "73/",
   "7b": "7b-/",
   "7d": "7d-/",
   "7n": "7n/",
   "9": "92213/",
   "11": "1121/",
   "13": "13/",
   "14": "14-2/",
   "15": "152/",
   "15a": "15a/",
   "15b": "15b2/",
   "15d": "15b221/",
   "16": "16-2/",
   "25": "25/",
   "25a": "25a-/",
   "25b": "25b311/",
   "25d": "25d21/",
   "25n": "25n/",
   "25x": "25x3111/",
   "26": "26/",
   "27": "272/",
   "27a": "27a-/",
   "27b": "27b21/",
   "27x": "27x-Revised-Fares2/",
   "29a": "29a/",
   "29n": "29n/",
   "31a": "31a-1/",
   "31b": "31b21/",
   "31d": "7d-Revised-Times23/",
   "31n": "31n-Revised-Times/",
   "32": "321/",
   "32x": "32x-/",
   "33": "331/",
   "33d": "33d-11/",
   "33n": "33n-Revised-Times/",
   "33x": "33x-11/",
   "37": "37-1/",
   "38": "38-/",
   "38a": "38a-1/",
   "38b": "38b/",
   "39": "393/",
   "39a": "39a-3/",
   "39x": "27x-Revised-Fares12/",
   "40": "40-/",
   "40b": "40b-/",
   "40d": "40d/",
   "40e": "40d1/",
   "41": "412/",
   "41b": "41b-/",
   "41c": "41c-/",
   "41x": "41x-1/",
   "42": "422/",
   "41d": "41d/",
   "42d": "7d-Revised-Times221/",
   "42n": "42n/",
   "43": "432/",
   "44": "441/",
   "44b": "44b2/",
   "46a": "46a-2113/",
   "46e": "46e-1/",
   "46n": "46n/",
   "47": "471/",
   "49": "49/",
   "49n": "49n/",
   "51d": "51d/",
   "51x": "51x2/",
   "53": "53/",
   "53a": "531/",
   "54a": "54a-Revised-Times1/",
   "56a": "56a/",
   "61": "612/",
   "65": "6511/",
   "65b": "65b211/",
   "66": "6611/",
   "66a": "66a/",
   "66b": "66b/",
   "66e": "66111/",
   "66n": "66n/",
   "66x": "66x11/",
   "67": "671/",
   "67n": "67n/",
   "67x": "67x31/",
   "68a": "68-111111/",
   "68x": "68x-/",
   "69": "69-211/",
   "69n": "69n/",
   "69x": "69x-/",
   "70": "703/",
   "70d": "7d-Revised-Times211/",
   "70n": "70n-Revised-Times/",
   "77a": "77a-1/",
   "77n": "77n/",
   "77x": "77x21/",
   "79a": "79a/",
   "83": "8321/",
   "84a": "84a1/",
   "84n": "84n-Revised-Times1/",
   "84x": "84x21111/",
   "88n": "88n-Revised-Times/",
   "90": "902/",
   "116": "116/",
   "118": "11811/",
   "120": "12021/",
   "122": "122-1113/",
   "123": "12322111112/",
   "130": "1301/",
   "140": "140-/",
   "142": "14222/",
   "145": "145-/",
   "150": "150-/",
   "151": "1512/",
   "155": "181/",
   "747": "74711211/",
   "757": "7471111/",
};

export default LineBox;