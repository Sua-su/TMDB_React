/**
 * Custom hook to fetch movies from the API.
 * @param {string} url - The URL for the API endpoint.
 * @param {number} currentPage - The current page number.
 * @returns {Object} - An object containing movies, loading, and error states.
 */
import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch movies from the API.
 * @param {string} url - The URL for the API endpoint.
 * @param {number} currentPage - The current page number.
 * @returns {Object} - An object containing movies, loading, and error states.
 */
function useFetchMovies(url, currentPage) {
    const [movies, setMovies] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_KEY = 'c12ed457b94399d3c810d10b94e4e4c5';
    const API_URL = 'https://api.themoviedb.org/3';
    const ERROR_MESSAGES = {
        NO_MOVIE_FOUND: 'No movie found',
        LOADING_ERROR: 'There was a problem loading the movies.',
    };

    useEffect(() => {
        /**
         * Fetches movies from the API based on the provided URL and current page number.
         * @throws {Error} - If there is an error in fetching movies.
         */
        async function fetchMovies() {
            setLoading(true);
            setError(null);
            try {
                const fullUrl = `${API_URL}${url}&api_key=${API_KEY}&page=${currentPage}`;
                const response = await fetch(fullUrl);
                if (response.ok) {
                    const data = await response.json();
                    if (data.results && data.results.length > 0) {
                        setMovies(data.results);
                    } else {
                        setMovies([]);
                        setError(ERROR_MESSAGES.NO_MOVIE_FOUND);
                    }
                } else {
                    setError(ERROR_MESSAGES.LOADING_ERROR);
                }
            } catch (error) {
                setError(ERROR_MESSAGES.LOADING_ERROR);
            } finally {
                setLoading(false);
            }
        }

        if (url !== '') {
            fetchMovies();
        }
    }, [url, currentPage]);

    return { movies, loading, error };
}

export default useFetchMovies;
