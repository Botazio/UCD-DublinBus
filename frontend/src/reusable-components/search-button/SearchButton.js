import SearchButtonCSS from "./SearchButton.module.css";

// This component displays a search button that pulses when the search is available
const SearchButton = ({ searchAvailable }) => {
  return (
    <div className={SearchButtonCSS.search_button + " " + (searchAvailable ? SearchButtonCSS.active : "")}>
      <h3>Search</h3>
    </div>
  );
};

export default SearchButton;
