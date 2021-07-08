import AuthenticationCSS from '../Authentication.module.css';
import { Link } from 'react-router-dom';
import { ReactComponent as Person } from '../fixtures/icon-person.svg';
import { ReactComponent as Lock } from '../fixtures/icon-lock.svg';
import { ReactComponent as Google } from '../fixtures/icon-google.svg';
import { ReactComponent as Facebook } from '../fixtures/icon-facebook.svg';
import { useAuth } from '../../../providers/AuthContext';
import { useRef, useState } from 'react';
import { useEffect } from 'react';

const SignIn = () => {
   const usernameRef = useRef();
   const passwordRef = useRef();
   const { signin, errorMessage } = useAuth();
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   // Uses the error from the context to display a message
   useEffect(() => {
      setError(errorMessage);
   }, [errorMessage]);

   // Set the error to null the first time the component renders
   useEffect(() => {
      setError(null);
   }, []);

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

         {/* If there is an error display it */}
         {error && (
            <div className={AuthenticationCSS.error_wrapper}>
               {error}
            </div>
         )}

         <form className={AuthenticationCSS.form} onSubmit={handleSubmit}>
            <div className={AuthenticationCSS.email_wrapper}>
               <div>
                  <Person height={'16px'} fill={'#808080'} />
               </div>
               <input className={AuthenticationCSS.login_username} ref={usernameRef} type="text" name="username" placeholder="Username or Email" autoFocus="" required=""></input>
            </div>
            <div className={AuthenticationCSS.password_wrapper}>
               <div>
                  <Lock height={'16px'} fill={'#808080'} />
               </div>
               <input className={AuthenticationCSS.login_password} ref={passwordRef} type="password" name="password" placeholder="Password" required=""></input>
            </div>
            <Link className={AuthenticationCSS.reset_password} to="/">Forgot your password?</Link>
            <button disabled={loading} className={AuthenticationCSS.submit_button}><span>Sign in</span></button>
         </form>

      </div>
   );

   async function handleSubmit(e) {
      e.preventDefault();

      // Error handling 
      if (usernameRef.current.value === '') {
         return setError('Username must be filled')
      }
      if (passwordRef.current.value === '') {
         return setError('Email must be filled')
      }

      try {
         setError('');
         setLoading(true);
         signin(usernameRef.current.value, passwordRef.current.value, setError);
      } catch {
         setError('Failed to sign in');
      }
      setLoading(false);

   }
}

export default SignIn;