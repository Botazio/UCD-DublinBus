import GoogleLogin from 'react-google-login';
import { ReactComponent as GoogleIcon } from "../fixtures/icon-google.svg";
import { ReactComponent as FacebookIcon } from "../fixtures/icon-facebook.svg";
import AuthenticationCSS from "../Authentication.module.css";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useAuth } from '../../../providers/AuthContext';

const OAuth = () => {
   // Hook to get the variables from the authentication context
   const { signinOAuth } = useAuth();

   const responseGoogle = (response) => {
      signinOAuth("google", response.tokenId);
   };

   const responseFacebook = (response) => {
      signinOAuth("facebook", response.accessToken);
   };

   return (
      <div className={AuthenticationCSS.buttons_wrapper}>

         <GoogleLogin
            clientId="723611798571-lkm0i6vo5s0gf9t3sfgcvk2c8vtvh4bn.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
            render={renderProps => (
               <button onClick={renderProps.onClick} className={AuthenticationCSS.google_button}>
                  <GoogleIcon height={"16px"} fill={"white"} />
                  <span>Google</span>
               </button>

            )}
         />

         <FacebookLogin
            appId="329230018881918"
            fields="name,email,picture"
            /* onClick={componentClicked} */
            callback={responseFacebook}
            render={renderProps => (
               <button onClick={renderProps.onClick} className={AuthenticationCSS.facebook_button}>
                  <FacebookIcon height={"16px"} fill={"white"} />
                  <span>Facebook</span>
               </button>
            )}
         />
      </div>
   );
};

export default OAuth;