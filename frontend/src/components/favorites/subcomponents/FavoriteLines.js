import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../../providers/AuthContext";
import CustomError from "../../../reusable-components/error/CustomError";
import FavoritesCSS from "../Favorites.module.css";
import PrimaryPagination from "../../../reusable-components/custom-pagination/PrimaryPagination";
import Card from "../../../reusable-components/card/Card";
import Waiting from "../../../reusable-components/waiting/Waiting";
import { useLines } from "../../../providers/LinesContext";
import SecondarySearchBarLines from "../../../reusable-components/searchbar-lines/SecondarySearchBarLines";
import LineBox from "../../lines/subcomponents/LineBox";

// This component renders the favorite lines
const FavoriteLines = () => {
   // Lines to be displayed on the page. They are filtered by the search bar 
   const [visibleLines, setVisibleLines] = useState();
   // User lines
   const [filteredLines, setFilteredLines] = useState();
   // State for the pagination in the results
   const [page, setPage] = useState(1);

   // Get the data from the provider
   const { data: lines, isPending, error } = useLines();

   // Get the user stops from the user provider
   const { currentUser } = useAuth();
   const favoriteLines = currentUser.favoritelines;

   // Set the visible stops to all of them the first time the component renders
   useEffect(() => {
      if (lines && favoriteLines) {
         // Get the full line object
         const arrayLines = lines.filter(
            ({ route__route_short_name: name1, direction_id: dir1 }) => favoriteLines.some(({ route_short_name: name2, direction_id: dir2 }) => (name1 === name2 && dir1 === dir2)));
         setFilteredLines(arrayLines);
         setVisibleLines(arrayLines);
      }
   }, [lines, favoriteLines]);

   // function that sets the results page with the new value
   const handlePage = (event, value) => {
      setPage(value);
   };

   // Error handling when fetching for the data
   if (error) return <CustomError height="60" message="Unable to fetch the data" />;

   // Wait for the data
   if (isPending) return <Waiting variant="dark" />;


   return (
      <>
         <div className={FavoritesCSS.info_wrapper}>
            {/* Loop through the visible lines and display them */}
            {visibleLines && <Card>
               <SecondarySearchBarLines lines={filteredLines} setVisibleLines={setVisibleLines} classes={FavoritesCSS.searchbar} />
               {visibleLines.map((line) => {
                  return (
                     <LineBox selectedLine={line} variant="full_width" />
                  );
               })}
            </Card>}

            {/* Pagination for the results */}
            {visibleLines && <div className={FavoritesCSS.pagination}>
               <PrimaryPagination onChange={handlePage} page={page} count={Math.ceil(visibleLines.length / 10)} color="primary" size="small" />
            </div>}

         </div>
      </>
   );
};

export default FavoriteLines;