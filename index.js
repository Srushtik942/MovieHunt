require('dotenv').config();
const express = require('express');
const{searchMovies, getActors,searchListByGenreAndActor,sortingByRating,getTopFiveMovies} = require('./Controllers/apiControllers');
const{createCuratedList, updateCuratedList,addInToWatchlist,addIntoWishlist,addToCuratedListItem,addReviewsAndRatings} = require('./Controllers/userApiControllers');
const app = express();
app.use(express.json());


app.get('/api/search/movie',searchMovies);
app.get('/api/movie/:movieId/actors',getActors);
app.post('/api/curated-lists',createCuratedList);
app.put('/api/curated-lists/:curatedListId',updateCuratedList);
app.post('/api/movies/watchlist',addInToWatchlist);
app.post('/api/movies/wishlist',addIntoWishlist);
app.post('/api/movies/curated-listItem',addToCuratedListItem);
app.post('/api/movies/:movieId/reviews',addReviewsAndRatings);
app.get('/api/movies/searchByGenreAndActor',searchListByGenreAndActor);
app.get('/api/movies/sort',sortingByRating);
app.get('/api/movies/top5',getTopFiveMovies);


const PORT = 3000

app.listen(PORT,()=>{
    console.log(`Server is running on the port ${PORT}`);
})

module.exports = {app};