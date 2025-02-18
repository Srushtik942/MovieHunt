require('dotenv').config();
const express = require('express');
const{searchMovies, getActors} = require('./Controllers/apiControllers');
const{createCuratedList, updateCuratedList,addInToWatchlist} = require('./Controllers/userApiControllers');
const app = express();
app.use(express.json());


app.get('/api/search/movie',searchMovies);
app.get('/api/movie/:movieId/actors',getActors);
app.post('/api/curated-lists',createCuratedList);
app.put('/api/curated-lists/:curatedListId',updateCuratedList);
app.post('/api/movies/watchlist',addInToWatchlist);

const PORT = 3000

app.listen(PORT,()=>{
    console.log(`Server is running on the port ${PORT}`);
})

module.exports = {app};