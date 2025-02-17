const { where } = require('sequelize');
const {curatedList: curatedListModel, wishlist: wishlistModel, movie:movieModel, watchlist: watchlistModel} = require('../models');
const { movieExistsInDB, fetchMovieAndCastDetails } = require('../services/movieService');

const createCuratedList = async(req,res)=>{
    try{
        const {name, description, slug} = req.body;

        if(!name || !description || !slug ){
            return res.status(404).json({message: "Check the request body again!"});
        }

        const curateList = await curatedListModel.create({name, description, slug});

        return res.status(200).json({message: 'Curated list created successfully.'});

    }catch(error){
    return res.status(500).json({message:"Internal Server Error!", error: error.message});
    }
};
// update Curated List:
const updateCuratedList = async(req,res)=>{
    try{
        const {curatedListId} = req.params;
        const {name, description} = req.body;

        const updateCurateList = await curatedListModel.update(
            {name, description},
            {where: {id: curatedListId}}
        );

        return res.status(200).json({message: 'Curated list updated successfully.',updateCurateList});

    }catch(error){
        return res.status(500).json({message : 'Internal Server Error!', error: error.message});
    }
}


// save to watchList :

const addIntoWatchlist = async (req, res) => {
    try {
        const { movieId } = req.body;

        if (!movieId) {
            return res.status(400).json({ message: "tmdbId and movieId are required!" });
        }

        let movie = await movieExistsInDB(movieId);

        if (!movie) {
            movie = await fetchMovieAndCastDetails(movieId); // This will throw an error if something goes wrong
            movie = await movieModel.create(movie);
        }

        const saveToWatchList = await watchlistModel.create({ movieId: movie.id });

        return res.status(200).json({ message: "Movie added to watchlist successfully!", saveToWatchList });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error!", error: error.message });
    }
};


module.exports = {createCuratedList, updateCuratedList, addIntoWatchlist};