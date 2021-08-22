import CustomTextField from "../../custom-textfield/CustomTextField";
import ActionCSS from "../Action.module.css";

const TextFieldAction = ({ value, setValue, message, ...restProps }) => {
   const handleChange = (event) => {
      setValue(event.target.value);
   };

   return (
      <div className={ActionCSS.action_info}>
         <CustomTextField
            variant="outlined"
            color="primary"
            size="small"
            value={value}
            fullWidth={true}
            onChange={handleChange}
            {...restProps}
         />
         <p>{message}</p>
      </div>
   );
};

export default TextFieldAction;