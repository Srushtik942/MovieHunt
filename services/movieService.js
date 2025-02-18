const axiosInstance = require('axios');
const {movie:movieModel} = require ("../models")
const TMDB_API_KEY = process.env.API_KEY;
// Service Function
// checking movie Exist in db or not
const movieExistsInDB = async(movieId)=>{
    const existInDB = await movieModel.findOne({where: {tmdbId :movieId }});

    return existInDB ? true : false ;
}

// fetching movie and cast details

const fetchMovieAndCastDetails = async(tmdbId) =>{
   if(!tmdbId){
    throw new Error("Invalid tmdbId");
   }
   try{
     const movieResponse = await axiosInstance.get(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`);
     const castResponse = await axiosInstance.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`);

     const movieData = movieResponse.data;
     const castData = castResponse.data.cast.slice(0,5).map((actor)=>actor.name).join(", ");
     return{
        // title: movieData.title,
        tmdbId: movieData.id,
        genre: movieData.genres.map((g)=>g.name).join(", "),
        actors: castData,
        release_Date: movieData.release_Date,
        rating :movieData.vote_average,
        description: movieData.overview,
     };
     }catch(error){
        if(error.response && error.response.status === 401) {
            throw new Error("Unauthorized request! Check your API key.");
          }
       throw new Error(`Internal Server Error!"${error.message}`);
   }
}

module.exports = {movieExistsInDB, fetchMovieAndCastDetails};

