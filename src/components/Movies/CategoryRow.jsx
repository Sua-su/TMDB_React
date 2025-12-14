import React from 'react';
import MovieCard from './MovieCard';
import LoadingSpinner from "../home/LoadingSpinner";

// Constant strings
const ERROR_MESSAGE = '영화를 불러오는 중 오류가 발생했습니다';

/**
 * Component for displaying a row of movies in a category.
 * @param {boolean} loading - Indicates if movies are loading.
 * @param {string} error - The error message, if any.
 * @param {Array} movies - The list of movies to display.
 * @param {string} categoryName - The name of the category.
 * @param {number} categoryIndex - The index of the category.
 * @returns {JSX.Element} - CategoryRow component.
 */
function CategoryRow({ loading, error, movies, categoryName, categoryIndex }) {
    // Split movies array into groups of 4
    const movieGroups = [];

    if (loading) {
        return (
            <LoadingSpinner/>
        );
    }

    if (error || !movies) {
        return (
            <div className="row">
                <div className="col-12">
                    <h2>{categoryName}</h2>
                </div>
                <div className="col d-flex justify-content-center mt-5">
                    <div className="alert alert-danger" role="alert">
                        {ERROR_MESSAGE}
                    </div>
                </div>
            </div>
        );
    }

    for (let i = 0; i < movies.length; i += 4) {
        movieGroups.push(movies.slice(i, i + 4));
    }

    return (
        <div key={categoryIndex}>
            <h2>{categoryName}</h2>
            <div id={`carousel${categoryIndex}`} className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {movieGroups.map((group, index) => (
                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2">
                                {group.map((movie) => (
                                    <MovieCard
                                        key={movie.id}
                                        movie={movie}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button className="carousel-control-prev prev-button" type="button" data-bs-target={`#carousel${categoryIndex}`} data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">이전</span>
                </button>
                <button className="carousel-control-next next-button" type="button" data-bs-target={`#carousel${categoryIndex}`} data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">다음</span>
                </button>
            </div>
        </div>
    );
}

export default CategoryRow;
