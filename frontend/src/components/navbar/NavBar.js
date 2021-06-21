import NavbarCSS from './Navbar.module.css';
import { ReactComponent as Login } from './fixtures/icon-login.svg';

const Navbar = () => {

   return (
      <nav className={NavbarCSS.navbar}>
         <div className={NavbarCSS.empty_div}></div>
         <div className={NavbarCSS.navbar_logo}>
            <h2 id="logo-navbar">DUBLIN BUS</h2>
         </div>
         <div className={NavbarCSS.login_icon}>
            <Login height={'30'} />
         </div>
      </nav>
   );
}

export default Navbar;