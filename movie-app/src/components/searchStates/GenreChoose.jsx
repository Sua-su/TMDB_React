import React, { useEffect, useState } from 'react';

/**
 * Component for selecting a genre and updating the search URL.
 * @param {Object} props - Component props.
 * @param {Function} props.setUrl - Function to set the search URL.
 * @returns {JSX.Element} - GenreChoose component.
 */
function GenreChoose({ setUrl }) {
    const [genres, setGenres] = useState([]);
    const API_KEY = 'c12ed457b94399d3c810d10b94e4e4c5';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const GENRE_LIST_URL = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=ko-KR`;

    useEffect(() => {
        /**
         * Fetches the genre list from the API.
         */
        const fetchGenres = async () => {
            try {
                const response = await fetch(GENRE_LIST_URL);
                if (response.ok) {
                    const data = await response.json();
                    setGenres(data.genres);
                } else {
                    console.error('Error fetching genre list');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchGenres();
    }, []);

    /**
     * Handles the genre selection change event.
     * Updates the search URL based on the selected genre.
     * @param {number} genreId - The selected genre ID.
     */
    const handleGenreChange = (genreId) => {
        const url = `/discover/movie?include_adult=false&language=en-US&page=1&with_genres=${genreId}`;
        setUrl(url);
    };

    return (
        <div className="p-3 d-flex justify-content-center">
            <div className="dropdown">
                <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    Select Genre
                </a>

                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    {genres.map(genre => (
                        <li key={genre.id}><a className="dropdown-item" href="#" onClick={() => handleGenreChange(genre.id)}>{genre.name}</a></li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default GenreChoose;
