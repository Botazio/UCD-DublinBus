import Card from "../../../reusable-components/card/Card";
import LinesCSS from "../Lines.module.css";
import PictureAsPdfRoundedIcon from '@material-ui/icons/PictureAsPdfRounded';

const LineBox = ({ selectedLine }) => {
   return (
      <Card variant="last">
         <div className={LinesCSS.line_title}>
            <div>
               <h4>Line {selectedLine.route__route_short_name}</h4>
               <p>{selectedLine.trip_headsign}</p>
            </div>
            <PictureAsPdfRoundedIcon />
         </div>
      </Card>
   );
};

export default LineBox;