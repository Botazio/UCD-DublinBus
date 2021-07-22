import AppearenceCSS from "../Appearence.module.css";
import PopoverColorPicker from './PopoverColorPicker';


const CusThemesButtons = ({ boxTheme, setBoxTheme }) => {

   return (
      <div className={AppearenceCSS.cus_themes_wrapper}>
         <PopoverColorPicker type="primary" boxTheme={boxTheme} setBoxTheme={setBoxTheme} />
         <PopoverColorPicker type="background primary" boxTheme={boxTheme} setBoxTheme={setBoxTheme} />
         <PopoverColorPicker type="background secondary" boxTheme={boxTheme} setBoxTheme={setBoxTheme} />
         <PopoverColorPicker type="divider" boxTheme={boxTheme} setBoxTheme={setBoxTheme} />
         <PopoverColorPicker type="icons & font color" boxTheme={boxTheme} setBoxTheme={setBoxTheme} />
      </div>
   );
};

export default CusThemesButtons;