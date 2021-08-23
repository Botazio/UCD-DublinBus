import HelpIcon from '@material-ui/icons/Help';
import Collapsible from 'react-collapsible';
import { Dialog, useTheme } from "@material-ui/core";
import PlannerCSS from "../Planner.module.css";

const QuantileGraph = ({ open, handleClose, origin, destination }) => {

   // Grab the theme from the provider
   const theme = useTheme().theme;

   // Url for the plot file
   const dotplotFile = `https://dublin-bus.net/images/dotplot_${origin.stop_id}_to_${destination.stop_id}.png`;

   return (
      <Dialog open={open} onClose={handleClose}>
         <div className={PlannerCSS.quantile_graph}>
            <img src={dotplotFile} alt="Quantile Dot Plot Unavailable" />
            <Collapsible trigger={<HelpIcon></HelpIcon>}>
               <p>
                  The Quantile Dotplot is an easy way to make probability estimates of journey times. There will always be
                  20 dots in this chart and the number of dots before a point on the x-axis is the fraction of
                  journeys that should take less than this time. For example, if there are 5
                  dots before 2 minutes, 5/20 (or 25%) of journeys should take less than
                  this time. The red line is the mean predicted journey time.<br />
                  <a href="https://dl.acm.org/doi/10.1145/2858036.2858558"
                     target="_blank"
                     rel="noreferrer"
                     style={{ color: theme.primary }}>Learn more</a>
               </p>
            </Collapsible>
         </div>
      </Dialog>
   );
};

export default QuantileGraph;