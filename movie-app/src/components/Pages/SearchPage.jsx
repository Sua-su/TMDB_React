import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SearchProvider } from '../context/SearchContext';

import DatePick from '../searchStates/DatePick';
import GenreChoose from '../searchStates/GenreChoose';
import MoviePage from '../Movies/MoviePage';
import useFetchMovies from '../searchStates/useFetchMovies';
import LoadingSpinner from "../home/LoadingSpinner";
import SearchMovie from "../searchStates/MovieSearch";
import SearchActor from "../searchStates/ActorSearch";
import SearchNavigator from "../searchStates/SearchNavigation";

/**
 * Component for the search page.
 * @returns {JSX.Element} - SearchPage component.
 */
function SearchPage() {
    const [url, setUrl] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const { movies, setMovies, loading, error } = useFetchMovies(url, currentPage);

    /**
     * Handles the change of the search URL.
     * Resets the page to the first page whenever the URL changes.
     * @param {string} newUrl - The new search URL.
     */
    const handleUrlChange = (newUrl) => {
        setCurrentPage(1);
        setUrl(newUrl);
    };

    return (
        <>
            <SearchProvider>
                <SearchNavigator />
                <Routes>
                    <Route path="/*" element={<SearchMovie setUrl={handleUrlChange} />} />
                    <Route path="/genre-choose" element={<GenreChoose setUrl={handleUrlChange} />} />
                    <Route path="/date-pick" element={<DatePick setUrl={handleUrlChange} />} />
                    <Route path="/actor-search" element={<SearchActor setUrl={handleUrlChange} />} />
                </Routes>
            </SearchProvider>
            {loading ? (
                <LoadingSpinner/>
            ) : (
                <MoviePage
                    movies={movies}
                    setMovies={setMovies}
                    loading={loading}
                    error={error}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </>
    );
}

export default SearchPage;
