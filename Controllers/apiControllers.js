const { default: axios } = require('axios');
require('dotenv').config();
const axiosInstance = require('../library/axios.lib');
const TMDB_API_KEY = process.env.API_KEY;

// : Making API Calls From TMDB
const searchMovies = async(req,res)=>{
    try{

     const{query} = req.query;

    const response = await axiosInstance.get(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${TMDB_API_KEY}`);

    const movies = response.data.results.map((movie)=>({
        title: movie.title,
        tmdbid: movie.id,
        genre: movie.genre_ids,
        releaseYear:movie.release_date,
        rating :movie.vote_average,
        description: movie.overview,
    }));
    console.log(movies);
   return  res.status(200).json({message:"Movie fetched successfully!", movies});

    }catch(error){
       return res.status(500).json({message:"Internal Server Error!", error: error.message});
    }
}

console.log(searchMovies)


// const getActors = async(req,res)=>{
//     try{
//         const {}
//         const response = await axiosInstance.get(`https://api.themoviedb.org/3/movie/movieId/credits`);

//         const actors = response.data.cast.filter((person)=>person.known_for_department === 'Acting').map((actor)=>actor.name);

//         return res.status(200).json({actors});


//     }catch(error){
//         res.status(500).json({messgae:"Internal Server Error!",error: error.message});
//     }
// }

module.exports = {searchMovies}