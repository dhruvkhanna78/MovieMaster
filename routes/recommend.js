const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const genreMap = {
    action: '28',
    adventure: '12',
    animation: '16',
    comedy: '35',
    crime: '80',
    documentary: '99',
    drama: '18',
    family: '10751',
    fantasy: '14',
    history: '36',
    horror: '27',
    music: '10402',
    mystery: '9648',
    romance: '10749',
    science_fiction: '878',
    tv_movie: '10770',
    thriller: '53',
    war: '10752',
    western: '37'
};

router.get('/', async (req, res) => {
    const { mood, genre } = req.query;

    if (!mood && !genre) {
        return res.status(400).json({ error: "Mood or genre is required in query parameters." });
    }

    let genreIds = [];

    if (mood && moodGenreMap[mood]) genreIds.push(moodGenreMap[mood]);
    if (genre && genreMap[genre]) genreIds.push(genreMap[genre]);

    
    const pagesToFetch = [1, 2, 3]; 

    try {
        const urls = pagesToFetch.map(
            page => `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&include_adult=true&language=en-US&sort_by=popularity.desc&with_genres=${genreIds.join(',')}&vote_count.gte=1000&page=${page}`
        );

        const responses = await Promise.all(urls.map(url => axios.get(url)));

        const allMovies = responses.flatMap(response =>
            response.data.results.map(movie => ({
                title: movie.title,
                overview: movie.overview,
                rating: movie.vote_average,
                poster: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : null
            }))
        );

        if (allMovies.length === 0) {
            return res.status(404).json({ error: "No movies found matching your criteria." });
        }

        res.json({ movies: allMovies });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Something went wrong while fetching from TMDB." });
    }
});

module.exports = router;
