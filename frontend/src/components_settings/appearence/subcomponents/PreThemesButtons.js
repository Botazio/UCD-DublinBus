import AppearenceCSS from "../Appearence.module.css";
import { createTheme } from '@material-ui/core/styles';

// Predefined themes 
const defaultThemeLight = createTheme({
   theme: {
      primary: "#0094EC",
      divider: "#D3D3D3",
      background_primary: "#FFFFFF",
      background_secondary: "#fafafa",
      icons: "#000000",
      fontColor: "#000000"
   },
});

const defaultThemeDark = createTheme({
   theme: {
      primary: "#239C7D",
      divider: "#FFFFFF",
      background_primary: "#010409",
      background_secondary: "#282931",
      icons: "#FFFFFF",
      fontColor: "#FFFFFF",
   },
});

const defaultThemeDarkGray = createTheme({
   theme: {
      primary: "#7F7DA2",
      divider: "#BFFCFC",
      background_primary: "#2F4F4F",
      background_secondary: "#3A616E",
      icons: "#BFFCFC",
      fontColor: "#FFFFFF"
   },
});

// This component renders bottom that allows the user to change UI 
// to the themes defined above. Firstly, it changes the ThemeBox then
// the user needs to save the changes
const PreThemesButtons = ({ boxTheme, setBoxTheme }) => {
   return (
      <div className={AppearenceCSS.pre_themes_wrapper}>
         <div className={AppearenceCSS.pre_themes_button} onClick={() => setBoxTheme({ ...boxTheme, ...defaultThemeLight })}>
            <div id={AppearenceCSS.pre_themes_button1}></div>
         </div>
         <div className={AppearenceCSS.pre_themes_button} onClick={() => setBoxTheme({ ...boxTheme, ...defaultThemeDark })}>
            <div id={AppearenceCSS.pre_themes_button2}></div>
         </div>
         <div className={AppearenceCSS.pre_themes_button} onClick={() => setBoxTheme({ ...boxTheme, ...defaultThemeDarkGray })}>
            <div id={AppearenceCSS.pre_themes_button3}></div>
         </div>
      </div>
   );
};

export default PreThemesButtons;