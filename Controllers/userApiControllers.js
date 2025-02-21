const { where } = require('sequelize');
const {curatedList: curatedListModel, wishlist: wishlistModel, movie:movieModel, watchlist: watchlistModel, curatedListItem: curatedListItemModel, review: reviewModel} = require('../models');
const { movieExistsInDB, fetchMovieAndCastDetails, checkMovieInCuratedList } = require('../services/movieService');

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
const addInToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    console.log(req.body);

    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required!" });
    }

    let movie = await movieExistsInDB(movieId);

    console.log(movie);

    if (!movie) {
      const movieData = await fetchMovieAndCastDetails(movieId);
      movie =  await movieModel.create(movieData);
    }
 const saveToWatchlist = await watchlistModel.create({ movieId :movie.id});


    return res.status(200).json({
        message: "Movie added to watchlist successfully!",
    });

  } catch (error) {
    return res.status(500).json({
         message: "Internal Server Error!",
          error: error.message
     });
  }
};

// save to wishlist

const addIntoWishlist = async(req,res)=>{
  try{
    const {movieId} = req.body;

    if(!movieId){
      return res.status(404).json({message:"Movie Id is required!"});
    }
    let movie = await movieExistsInDB(movieId);
    console.log(movie);

    if(!movie){
      const movieData = await fetchMovieAndCastDetails(movieId);
      movie = await movieModel.create(movieData);
    }
    const saveToWishlist = await wishlistModel.create({movieId: movie.id});

    return res.status(200).json({
      message: "Movie added into wishlist successfully!",

    })


  }catch(error){
    res.status(500).json({message:"Interanl Server Error!",error:error.message});
  }
}

//save to curated ListItem

const addToCuratedListItem = async(req,res)=>{
  try{
  const {movieId, curatedListId} = req.body;

  if(!movieId ){
    return res.status(404).json({message:"Movie Id is required!"});
  }
  //  let movie = await checkMovieInCuratedList(curatedListId);
   let movie = await movieExistsInDB(movieId);

   if(!movie){
    const movieData = await fetchMovieAndCastDetails(movieId);
    console.log(movieData);
     movie = await movieModel.create(movieData);
   }
   console.log(movie);
   const saveToCuratedListItem = await curatedListItemModel.create({
    curatedListId: curatedListId,
    movieId: movie.id
  });
  console.log(movie.id);


   return res.status(200).json({message:"Movie added to curated listItem successfully."});
  }
  catch(error){
    return res.status(500).json({message:"Internal Server Error!", error:error.message});
  }
}

// Adding Reviews and Ratings to Movies

const addReviewsAndRatings = async(req,res)=>{
  try{
  const {movieId} = req.params;
  const {rating, reviewText} = req.body;

  if(rating>10 || rating<0){
    return res.status(404).json({message:"Check your rating again!"});
  }
  if(reviewText.length > 500){
    return res.status(404).json({message:"Please keep your review under 500 characters!"});
  }
//  check movie present in db or not

let movie = await movieExistsInDB(movieId);

if(!movie){
  const movieData = await fetchMovieAndCastDetails(movieId);
  movie = await movieModel.create(movieData);
}
console.log("Movie data before saving review:", movie);

const saveToReview = await reviewModel.create({
  movieId: movie.id,
  rating: rating,
  reviewText:reviewText,
})
return res.status(200).json({message: "Review added successfully!"});
}catch(error){
  return res.status(500).json({message:"Internal Server Error!", error:error.message});
}
}


module.exports = {createCuratedList, updateCuratedList, addInToWatchlist, addIntoWishlist, addToCuratedListItem, addReviewsAndRatings};