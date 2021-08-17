import { Button } from '@material-ui/core';
import ToogleCSS from './StopsLinesToogle.module.css';

const StopsLinesToogle = ({ active, setActive }) => {

   return (
      <div className={ToogleCSS.toogle_buttons_wrapper}>
         <Button variant={(active === "stops" ? "contained" : "outlined")} fullWidth color="primary" size="small" onClick={() => setActive('stops')}>Stops</Button>
         <Button variant={(active === "lines" ? "contained" : "outlined")} fullWidth color="primary" size="small" onClick={() => setActive('lines')}>Lines</Button>
      </div>
   );
};

export default StopsLinesToogle;