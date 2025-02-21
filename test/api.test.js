const request = require('supertest');
const {app} = require('../index');
const http  = require('http');
const { updateCuratedList } = require('../Controllers/userApiControllers');


let server;

beforeAll((done)=>{
    server = http.createServer(app);
    server.listen(3001,done);
});

afterAll((done)=>{
    server.close(done);
});

// Testing endpoints

describe('API endpoints',()=>{
    it('should return 200 if curated list has been created!',async()=>{
        const response = await request(server).post('/api/curated-lists').send({
            name: 'Horror Movies',
            description: 'A collection of the best horror films.',
            slug: 'horror-movies'
        });
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: 'Curated list created successfully.'
        })
    });
    it('should return 404 if request body has missing something',async()=>{
        const response = await request(server).post('/api/curated-lists').send({
            name : 'Rom-Com Movie',
            description: 'A collection of best movies'
        })
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual( "Check the request body again!");
    });
    it('should return 200 if the curatedlist has been updated',async()=>{
        const response = await request(server).put('/api/curated-lists/2').send({

                name: 'Updated List Name',
                description: 'Updated description.'
        });
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: 'Curated list updated successfully.',
            updateCurateList : [1]
        })
    });
    it('should return 200 if the Movie added to watchlist',async()=>{
        const response = await request(server).post('/api/movies/watchlist').send({
        movieId : 27205
        })
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({

        message: "Movie added to watchlist successfully!"

        })
    });
    it('should return 200 if the movie added to wishlist',async()=>{
        const response = await request(server).post('/api/movies/wishlist').send({
                "movieId": 973484
        })
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
           message: 'Movie added into wishlist successfully!'
        })
    });
    it('should return 200 if the movie added to curated-list',async()=>{
        const response = await request(server).post('/api/movies/curated-listItem').send({
            'movieId': 27205,
            'curatedListId': 1
        })
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
             message: 'Movie added to curated listItem successfully.'
        })
    });
    it('should return 200 for Review adding successfully!',async()=>{
        const response = await request(server).post('/api/movies/27205/reviews').send({
            rating: 4.5,
            reviewText: 'Great movie with a brilliant plot.'
        })
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: 'Review added successfully!'
        })
    });
})

