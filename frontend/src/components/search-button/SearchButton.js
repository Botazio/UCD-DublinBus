import SearchButtonCSS from './SearchButton.module.css';

const SearchButton = ({ searchAvailable }) => {
   return (
      <div className={SearchButtonCSS.search_button + " " + (searchAvailable ? SearchButtonCSS.active : '')}>
         <h3>Search</h3>
      </div>
   );
}

export default SearchButton;