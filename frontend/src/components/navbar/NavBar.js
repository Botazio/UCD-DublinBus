import NavbarCSS from './Navbar.module.css';
import { ReactComponent as List } from './fixtures/icon-list.svg';
import { ReactComponent as Bus } from './fixtures/icon-bus.svg';
import { ReactComponent as Login } from './fixtures/icon-login.svg';

const Navbar = () => {

   return (
      <div>
         <nav className={NavbarCSS.navbar}>
            <div className={NavbarCSS.list_icon}>
               <List height={'25'} />
            </div>
            <div className={NavbarCSS.navbar_logo}>
               <Bus fill={'#B82025'} height={'40'} />
               <h2 id="logo-navbar">DUBLIN BUS</h2>
            </div>
            <div className={NavbarCSS.login_icon}>
               <Login height={'30'} />
            </div>
         </nav>
      </div>
   );
}

export default Navbar;