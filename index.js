const express = require('express');
const{searchMovies} = require('./Controllers/apiControllers');

const app = express();
app.use(express.json());


app.get('/api/search/movie',searchMovies);


const PORT = 3000

app.listen(PORT,()=>{
    console.log(`Server is running on the port ${PORT}`);
})

module.exports = {app};