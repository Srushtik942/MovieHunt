const { default: axios } = require('axios');
require('dotenv').config();
const axiosInstance = require('../library/axios.lib');
const { query } = require('express');
const TMDB_API_KEY = process.env.API_KEY;

if (!TMDB_API_KEY) {
      res.status(404).json({message:"Missing TMDB API Key! Check your .env file."});
}


// : Making API Calls From TMDB
const searchMovies = async(req,res)=>{
    try{

     const{query} = req.query;

     if(!query){
        return res.status(400).json({message:"Query is required!"});
     }

    const response = await axiosInstance.get(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${TMDB_API_KEY}`);

    const movies = response.data.results.map((movie)=>({
        title: movie.title,
        tmdbid: movie.id,
        genre: movie.genre_ids,
        releaseYear:movie.release_date,
        rating :movie.vote_average,
        description: movie.overview,
    }));
    // console.log(movies);
   return  res.status(200).json({message:"Movie fetched successfully!", movies});

    }catch(error){
       return res.status(500).json({message:"Internal Server Error!", error: error.message});
    }
}

const getActors = async(req,res)=>{
    try{

        const {movieId} =  req.params;

        const response = await axiosInstance.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`);

        const actors = response.data.cast
        .filter((actor) => actor.known_for_department === 'Acting')
        .map((actor)=>({
              name : actor.name,
              department : actor.known_for_department,
              popularity: actor.popularity,
              character: actor.character,
        }));

         console.log(actors);
        return res.status(200).json({ message: "Actors fetched successfully!", actors});


    }catch(error){
        res.status(500).json({messgae:"Internal Server Error!",error: error.message});
    }
}

module.exports = {searchMovies, getActors}