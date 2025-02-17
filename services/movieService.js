const axios = require('axios');
const axiosInstance = require('axios');
const {movie:movieModel} = require ("../models")
const access_key =  process.env.API_KEY;
// Service Function
// checking movie Exist in db or not
const movieExistsInDB = async(tmdbId)=>{
    const existInDB = await movieModel.findOne({where: {tmdbId }});

    return existInDB ? true : false ;
}

// fetching movie and cast details

if(!access_key){
    throw new Error('Missing Access Key in .env file!');
}

const fetchMovieAndCastDetails = async(tmdbId) =>{
   if(!tmdbId){
    throw new Error("Invalid tmdbId");
   }
   try{
     const movieResponse = await axiosInstance.get(`https://api.themoviedb.org/3/movie/${tmdbId}?access_key=${access_key}`);
     const castResponse = await axiosInstance.get(`https://api.themoviedb.org/3/movie/${tmdbId}/credits?access_key=${access_key}`);

     const movieData = movieResponse.data;
     console.log(movieData);
     const castData = castResponse.data.cast.slice(0,5).map((actor)=>actor.name);
     console.log(castData);
     return{
        tmdbId: movieData.id,
        title: movieData.title,
        genre: movieData.genres.name,
        adult: movieData.adult,
        releaseDate: movieData.release_Date,
        actors: castData,
     };
     }catch(error){
    res.status(500).json(`Internal Server Error!"${error.message}`);
   }
}

module.exports = {movieExistsInDB, fetchMovieAndCastDetails};

