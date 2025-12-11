import React from 'react';
import { HistoryProvider } from './HistoryContext';
import SearchBar from './SearchBar';

/**
 * Component for searching actors.
 * @param {Object} props - Component props.
 * @param {Function} props.setUrl - Function to set the search URL.
 * @returns {JSX.Element} - SearchActor component.
 */
function SearchActor({ setUrl }) {
    const searchUrl = '/discover/movie?include_adult=false&include_video=false&language=ko-KR&page=1&with_cast={name}';

    return (
        <HistoryProvider>
            <SearchBar setUrl={setUrl} searchUrl={searchUrl} />
        </HistoryProvider>
    );
}

export default SearchActor;
