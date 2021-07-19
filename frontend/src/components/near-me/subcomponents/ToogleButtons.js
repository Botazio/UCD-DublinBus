import NearMeCSS from '../NearMe.module.css';

const ToogleButtons = ({ active, setActive }) => {

   return (
      <div className={NearMeCSS.toogle_buttons_wrapper}>
         <button onClick={() => setActive('stops')} className={NearMeCSS.toogle_buttons_button + " " + (active === 'stops' ? NearMeCSS.toogle_buttons_active : '')}>Stops</button>
         <button onClick={() => setActive('lines')} className={NearMeCSS.toogle_buttons_button + " " + (active === 'lines' ? NearMeCSS.toogle_buttons_active : '')}>Lines</button>
      </div>
   );
};

export default ToogleButtons;