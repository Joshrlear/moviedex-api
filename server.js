require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const moviesData = require('./movies-data-small.json');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    let authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }

    next();
})

app.get('/movie', function handleGetMovies(req, res) {
    let response = moviesData;
    const { genre = 'comedy', country = 'United States', avg_vote = '7', name } = req.query;

    if (genre) {
        response = response.filter(movie =>
            movie.genre.toLowerCase().includes(genre.toLowerCase())
        );
    }

    if (country) {
        response = response.filter(movie =>
            movie.country.toLowerCase().includes(country.toLowerCase())
        );
    }
    
    if (avg_vote) {
        response = response.filter(movie =>
            movie.avg_vote >= avg_vote
        );
    }
    
    if (name) {
        response = response.filter(movie =>
            movie.film_title.toLowerCase().includes(name.toLowerCase())
        );
    }

    if (response.length === 0){ response = "Sorry, we couldn't find anything that matches your search."}

    res.json(response);
});

app.listen(8000, () => {
    console.log('Listening to PORT 8000.');
});