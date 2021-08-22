import { Button, useTheme } from '@material-ui/core';
import ToogleCSS from './StopsLinesToogle.module.css';

const StopsLinesToogle = ({ active, setActive }) => {

   // Grab the theme from the provider
   const theme = useTheme().theme;

   return (
      <div
         className={ToogleCSS.toogle_buttons_wrapper}
         style={{
            backgroundColor: theme.background_primary,
            border: `1px solid ${theme.divider}`
         }}>
         <Button variant={(active === "stops" ? "contained" : "outlined")} fullWidth color="primary" size="small" onClick={() => setActive('stops')}>Stops</Button>
         <Button variant={(active === "lines" ? "contained" : "outlined")} fullWidth color="primary" size="small" onClick={() => setActive('lines')}>Lines</Button>
      </div>
   );
};

export default StopsLinesToogle;