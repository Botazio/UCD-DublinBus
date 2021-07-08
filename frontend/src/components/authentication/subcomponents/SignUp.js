import AuthenticationCSS from '../Authentication.module.css';
import { ReactComponent as Person } from '../fixtures/icon-person.svg';
import { ReactComponent as Lock } from '../fixtures/icon-lock.svg';
import { ReactComponent as Email } from '../fixtures/icon-email.svg';
import { ReactComponent as Google } from '../fixtures/icon-google.svg';
import { ReactComponent as Facebook } from '../fixtures/icon-facebook.svg';
import { useAuth } from '../../../providers/AuthContext';
import { useEffect, useRef } from 'react';
import { useState } from 'react';

const SignUp = () => {
   const usernameRef = useRef();
   const emailRef = useRef();
   const passwordRef = useRef();
   const passwordConfirmRef = useRef();
   const { signup, errorMessage } = useAuth();
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
      <div className={AuthenticationCSS.signup_tab}>

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
            <div className={AuthenticationCSS.username_wrapper}>
               <div>
                  <Person height={'16px'} fill={'#808080'} />
               </div>
               <input className={AuthenticationCSS.login_username} ref={usernameRef} type="text" name="username" placeholder="Username" autoFocus="" required=""></input>
            </div>
            <div className={AuthenticationCSS.email_wrapper}>
               <div>
                  <Email height={'16px'} fill={'#808080'} />
               </div>
               <input className={AuthenticationCSS.login_email} ref={emailRef} type="text" name="email" placeholder="Email" autoFocus="" required=""></input>
            </div>
            <div className={AuthenticationCSS.password_wrapper}>
               <div>
                  <Lock height={'16px'} fill={'#808080'} />
               </div>
               <input className={AuthenticationCSS.login_password} ref={passwordRef} type="password" name="password" placeholder="Password" required=""></input>
            </div>
            <div className={AuthenticationCSS.password_wrapper}>
               <div>
                  <Lock height={'16px'} fill={'#808080'} />
               </div>
               <input className={AuthenticationCSS.login_password} ref={passwordConfirmRef} type="password" name="password" placeholder="Password confirmation" required=""></input>
            </div>
            <button disabled={loading} className={AuthenticationCSS.submit_button} type="submit"><span>Sign up</span></button>
         </form>
      </div>
   );

   async function handleSubmit(e) {
      e.preventDefault();

      // Error handling 
      if (usernameRef.current.value === '') {
         return setError('Username must be filled')
      }
      if (emailRef.current.value === '') {
         return setError('Email must be filled')
      }
      if (passwordRef.current.value !== passwordConfirmRef.current.value) {
         return setError('Passwords do not match');
      }
      if (passwordRef.current.value.length < 5) {
         return setError('Password must contain at least 5 characters')
      }
      if (passwordRef.current.value.length > 140) {
         return setError('Max password length 140 characters')
      }

      try {
         setError('');
         setLoading(true);
         signup(usernameRef.current.value, passwordRef.current.value);
      } catch {
         setError('Failed to create an account');
      }
      setLoading(false);

   }
}

export default SignUp;