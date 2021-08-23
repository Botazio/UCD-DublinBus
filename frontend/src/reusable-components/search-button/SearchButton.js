import { useTheme } from "@material-ui/core";
import SearchButtonCSS from "./SearchButton.module.css";

// This component displays a search button that pulses when the search is available
const SearchButton = ({ searchAvailable, ...restProps }) => {
  // Grab the theme from the provider
  const theme = useTheme().theme;

  return (
    <div
      {...restProps}
      className={SearchButtonCSS.search_button + " " + (searchAvailable ? SearchButtonCSS.active : "")}
      style={searchAvailable ?
        { backgroundColor: theme.primary, color: theme.background_primary, boxShadow: `0 0 0 0 ${theme.primary + 90}` } :
        {}}>
      <h3>Search</h3>
    </div>
  );
};

export default SearchButton;
