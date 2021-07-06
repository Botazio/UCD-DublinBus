import NavbarCSS from './Navbar.module.css';
import { ReactComponent as Login } from './fixtures/icon-login.svg';

const Navbar = () => {

   return (
      <nav className={NavbarCSS.navbar}>
         {/* We use this div to insert the list icon */}
         <div id="list_icon"></div>
         <div className={NavbarCSS.navbar_logo}>
            <h2 id="logo-navbar">DUBLIN BUS</h2>
         </div>
         <div className={NavbarCSS.login_icon}>
            <Login height={'25'} />
         </div>
      </nav>
   );
}

export default Navbar;