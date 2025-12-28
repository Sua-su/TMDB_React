import React from 'react';
import Pagination from './Pagination';
import MovieList from './MovieList';
import LoadingSpinner from '../home/LoadingSpinner';

const ERROR_MESSAGE = 'Oops! Something went wrong. Please try again.';
const SEARCH_MESSAGE = "Let's search for a movie!";
const TOTAL_PAGES = 20;

/**
 * Component for displaying a page of movies.
 * @param {Array} movies - The list of movies to display.
 * @param {Function} setMovies - The function to update the movies list.
 * @param {number} currentPage - The current page number.
 * @param {Function} setCurrentPage - The function to update the current page number.
 * @param {boolean} loading - Indicates if movies are loading.
 * @param {string} error - The error message, if any.
 * @returns {JSX.Element} - MoviePage component.
 */
function MoviePage({ movies, setMovies, currentPage, setCurrentPage, loading, error }) {
    /**
     * Handles the mouse enter event on a movie item.
     * @param {number} index - The index of the movie item.
     */
    const handleMouseEnter = (index) => {
        setMovies((prevMovies) => {
            const updatedMovies = [...prevMovies];
            updatedMovies[index] = { ...updatedMovies[index], hovered: true };
            return updatedMovies;
        });
    };

    /**
     * Handles the mouse leave event on a movie item.
     * @param {number} index - The index of the movie item.
     */
    const handleMouseLeave = (index) => {
        setMovies((prevMovies) => {
            const updatedMovies = [...prevMovies];
            updatedMovies[index] = { ...updatedMovies[index], hovered: false };
            return updatedMovies;
        });
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="alert alert-danger" role="alert">
                    {ERROR_MESSAGE}
                </div>
            </div>
        );
    }

    if (!movies) {
        return (
            <div className="card bg-dark text-center border-0">
                <div className="card-body">
                    <h2 className="card-title">{SEARCH_MESSAGE}</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <Pagination currentPage={currentPage} totalPages={TOTAL_PAGES} handlePageChange={setCurrentPage} />
            <MovieList movies={movies} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
            <Pagination currentPage={currentPage} totalPages={TOTAL_PAGES} handlePageChange={setCurrentPage} />
        </div>
    );
}

export default MoviePage;
