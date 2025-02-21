const { default: axios } = require('axios');
require('dotenv').config();
const axiosInstance = require('../library/axios.lib');
const {movie:movieModel , review:reviewModel} = require('../models');
const {Op} = require('sequelize')
const { query } = require('express');
const { where } = require('sequelize');
const TMDB_API_KEY = process.env.API_KEY;

if (!TMDB_API_KEY) {
      res.status(404).json({message:"Missing TMDB API Key! Check your .env file."});
}

// const actors = await

// : Making API Calls From TMDB
const searchMovies = async(req,res)=>{c
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


// Searching Lists by Genre and Actor

const searchListByGenreAndActor = async(req,res)=>{
    try{

    const {genre,actor} = req.query;
    if(!genre || !actor ){
        return res.status(400).json({message:"Check your query again!"});
    }

    const response = await movieModel.findOne({
        where:{
            genre : { [Op.like]: `%${genre}%`},
            actors: { [Op.like]: `%${actor}%`},
        }
    });

    if(!response){
        return res.status(404).json({message:"No movie found!"});
    }

    return res.status(200).json({movie : response});

    }catch(error){
        return res.status(500).json({message:"Internal Server Error!",error:error.message});
    }

  }

//   Sorting by Ratings

const sortingByRating = async(req,res)=>{
    try{
    const {list , sortBy, order} = req.query;

    if(!list || !sortBy ){
        return res.status(400).json({message:"Check your query again!"});
    }

    const sortOrder = order ? order.toUpperCase() : "ASC";

    // validate sorting fields

    const validateSortField = ["rating"];
    if(!validateSortField.includes(sortBy)){
        return res.status(400).json({message:"Invalid sort parameter!"});
    }

    const sortedMovies = await movieModel.findAll({
        attributes : ["title","tmdbId","genre","actors","rating"],
        order : [[ Sequelize.col(sortBy) ,sortOrder]],
    })

    if (sortedMovies.length === 0) {
        return res.status(404).json({ message: "No movies found in the list!" });
      }

    return res.status(200).json({sortedMovies});
    } catch(error){
      return res.status(500).json({message:"Internal Server Error!",error:error.message});
    }
}

const getTopFiveMovies = async(req,res)=>{
   try{
    const movies = await movieModel.findAll({
        attributes : ['title', 'tmdbId', 'genre','actors','rating'],
        limit : 5,
        order: [["rating","DESC"]],
        include:[
            {
                model: reviewModel,
                attributes : ["reviewText"],
            }
        ]
    });
    if(movies.length === 0){
        return res.status(404).json({message:"No movies found!"});
    }

    const moviesWithReviews = movies.map((movie)=>({
        title : movie.title,
        tmdbId: movie.tmdbId,
        genre : movie.genre,
        actors: movie.actors,
        rating: movie.rating,
        reviews : movie.reviews?movie.reviews.map((review)=>({
            reviewText: review.reviewText,
            wordCount: review.reviewText ? review.reviewText.split(/\s+/).length : 0,
        }))
        : [],

    }));

    return res.status(200).json({ movies: moviesWithReviews });

   }catch(error){
    res.status(500).json({message:"Internal Server Error!",error:error.message});
   }
}


module.exports = {searchMovies, getActors,searchListByGenreAndActor,sortingByRating,getTopFiveMovies}