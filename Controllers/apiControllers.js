const { default: axios } = require('axios');
require('dotenv').config();
const axiosInstance = require('../library/axios.lib');
const { query } = require('express');
const TMDB_API_KEY = process.env.API_KEY;

if (!TMDB_API_KEY) {
      res.status(404).json({message:"Missing TMDB API Key! Check your .env file."});
}

// const actors = await

// : Making API Calls From TMDB
const searchMovies = async(req,res)=>{
    try{

     const{query} = req.query;

     if(!query){
        return res.status(400).json({message:"Query is required!"});
     }

    const response = await axiosInstance.get(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${TMDB_API_KEY}`);

    const movies = await Promise.all(
        response.data.results.map(async(movie)=>{

            const actors = await getActors(movie.id);

            return {
                    title: movie.title,
                    tmdbid: movie.id,
                    genre: movie.genre_ids.join(", "),
                    actors: actors,
                    releaseYear:movie.release_date,
                    rating :movie.vote_average,
                    description: movie.overview,
            }

        })

    )
   return  res.status(200).json({message:"Movie fetched successfully!", movies});

    }catch(error){
       return res.status(500).json({message:"Internal Server Error!", error: error.message});
    }
}

// service function
const getActors = async(movieId)=>{
    try{

        const response = await axiosInstance.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`);

        const actors = response.data.cast
        .filter((actor) => actor.known_for_department === 'Acting')
        .map((actor)=> actor.name
        ).slice(0, 5).join(", ");

         console.log(actors);
        return actors || "unknown"


    }catch(error){
        console.error("Error in fetching actors", error.message);
    }
}

module.exports = {searchMovies, getActors}