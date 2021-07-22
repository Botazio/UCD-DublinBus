import AppearenceCSS from "../Appearence.module.css";

const UserMail = () => {

   return (
      <>
         <div className={AppearenceCSS.header_wrapper}>
            <div className={AppearenceCSS.header_title}>
               <h2>Theme preferences</h2>
            </div>
            <div className={AppearenceCSS.header_info}>
               <p>Choose how Dublin Bus looks to you.<br />Select one of our themes or create one!</p>
            </div>
         </div>

      </>
   );
};

export default UserMail;