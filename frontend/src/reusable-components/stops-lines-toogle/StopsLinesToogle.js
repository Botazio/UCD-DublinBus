import ToogleCSS from './StopsLinesToogle.module.css';

const StopsLinesToogle = ({ active, setActive }) => {

   return (
      <div className={ToogleCSS.toogle_buttons_wrapper}>
         <button onClick={() => setActive('stops')} className={ToogleCSS.toogle_buttons_button + " " + (active === 'stops' ? ToogleCSS.toogle_buttons_active : '')}>Stops</button>
         <button onClick={() => setActive('lines')} className={ToogleCSS.toogle_buttons_button + " " + (active === 'lines' ? ToogleCSS.toogle_buttons_active : '')}>Lines</button>
      </div>
   );
};

export default StopsLinesToogle;