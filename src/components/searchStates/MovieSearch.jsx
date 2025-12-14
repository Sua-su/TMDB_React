import React from 'react';
import { HistoryProvider } from './HistoryContext';
import SearchBar from './SearchBar';

/**
 * Component for searching movies.
 * @param {Object} props - Component props.
 * @param {Function} props.setUrl - Function to set the search URL.
 * @returns {JSX.Element} - SearchMovie component.
 */
function SearchMovie({ setUrl }) {
    const searchUrl = '/search/multi?query={name}&include_adult=false&language=ko-KR&page=1/`';

    return (
        <HistoryProvider>
            <SearchBar setUrl={setUrl} searchUrl={searchUrl} />
        </HistoryProvider>
    );
}

export default SearchMovie;
