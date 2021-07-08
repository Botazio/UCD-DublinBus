import NavbarCSS from './Navbar.module.css';
import { Link } from 'react-router-dom';
import { ReactComponent as Login } from './fixtures/icon-login.svg';
import { useAuth } from '../../providers/AuthContext';
import PopoverUser from '../popover-user/PopoverUser';
import { useEffect } from 'react';

const Navbar = () => {
   // change the user icon if there is a current user
   const { currentUser, logout, isAuthenticated } = useAuth();

   useEffect(() => {
      isAuthenticated();
      // eslint-disable-next-line
   }, [])

   return (
      <nav className={NavbarCSS.navbar}>
         {/* We use this div to insert the list icon */}
         <div id="list_icon"></div>
         <div className={NavbarCSS.navbar_logo}>
            <h2 className={NavbarCSS.logo_navbar_phone} id="logo_navbar_phone"> </h2>
            <h2 className={NavbarCSS.logo_navbar_desktop} id="logo_navbar_desktop">DUBLIN BUS</h2>
         </div>
         <div className={NavbarCSS.login_icon}>
            {/* Change the icon logo if there is a user log in*/}
            {!currentUser && <Link to='/login'><Login height={'25'} /></Link>}
            {currentUser && <PopoverUser currentUser={currentUser} logout={logout} />}
         </div>
      </nav>
   );
}

export default Navbar;