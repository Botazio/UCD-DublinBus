import AppearenceCSS from "../Appearence.module.css";
import { createTheme } from '@material-ui/core/styles';

const defaultThemeLight = createTheme({
   user: {
      primary: "#0094EC",
      divider: "#D3D3D3",
      background_primary: "#FFFFFF",
      background_secondary: "#fafafa",
      icons: "#000000",
      fontColor: "#000000"
   },
});

const defaultThemeDark = createTheme({
   user: {
      primary: "#239C7D",
      divider: "#FFFFFF",
      background_primary: "#010409",
      background_secondary: "#282931",
      icons: "#FFFFFF",
      fontColor: "#FFFFFF",
   },
});

const defaultThemeDarkGray = createTheme({
   user: {
      primary: "#7F7DA2",
      divider: "#BFFCFC",
      background_primary: "#2F4F4F",
      background_secondary: "#3A616E",
      icons: "#BFFCFC",
      fontColor: "#FFFFFF"
   },
});

const PreThemesButtons = ({ setBoxTheme }) => {
   return (
      <div className={AppearenceCSS.pre_themes_wrapper}>
         <div className={AppearenceCSS.pre_themes_button} onClick={() => setBoxTheme(defaultThemeLight)}>
            <div id={AppearenceCSS.pre_themes_button1}></div>
         </div>
         <div className={AppearenceCSS.pre_themes_button} onClick={() => setBoxTheme(defaultThemeDark)}>
            <div id={AppearenceCSS.pre_themes_button2}></div>
         </div>
         <div className={AppearenceCSS.pre_themes_button} onClick={() => setBoxTheme(defaultThemeDarkGray)}>
            <div id={AppearenceCSS.pre_themes_button3}></div>
         </div>
      </div>
   );
};

export default PreThemesButtons;