import AuthenticationCSS from '../Authentication.module.css';
import { Link } from 'react-router-dom';
import { ReactComponent as Person } from '../fixtures/icon-person.svg';
import { ReactComponent as Lock } from '../fixtures/icon-lock.svg';
import { ReactComponent as Google } from '../fixtures/icon-google.svg';
import { ReactComponent as Facebook } from '../fixtures/icon-facebook.svg';

const SignIn = () => {
   return (
      <div className={AuthenticationCSS.signin_tab}>
         <div className={AuthenticationCSS.buttons_wrapper}>
            <button className={AuthenticationCSS.google_button}>
               <Google height={'16px'} fill={'white'} />
               <span>Google</span>
            </button>
            <button className={AuthenticationCSS.facebook_button}>
               <Facebook height={'16px'} fill={'white'} />
               <span>Facebook</span>
            </button>
         </div>
         <form className={AuthenticationCSS.form}>
            <div className={AuthenticationCSS.email_wrapper}>
               <div>
                  <Person height={'16px'} fill={'#808080'} />
               </div>
               <input className={AuthenticationCSS.login_username} type="text" name="username" placeholder="Username or Email" autoFocus="" required=""></input>
            </div>
            <div className={AuthenticationCSS.password_wrapper}>
               <div>
                  <Lock height={'16px'} fill={'#808080'} />
               </div>
               <input className={AuthenticationCSS.login_password} type="password" name="password" placeholder="Password" required=""></input>
            </div>
            <Link className={AuthenticationCSS.reset_password} to="/">Forgot your password?</Link>
            <button className={AuthenticationCSS.submit_button}><span>Sign in</span></button>
         </form>
      </div>
   );
}

export default SignIn;