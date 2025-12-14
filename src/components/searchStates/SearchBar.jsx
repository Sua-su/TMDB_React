import React, { useState, useRef, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import HistoryList from './HistoryList';
import {useHistory} from "./HistoryContext";

/**
 * Component for displaying a search bar and handling search functionality.
 * @param {Object} props - Component props.
 * @param {Function} props.setUrl - Function to set the search URL.
 * @param {string} props.searchUrl - The search URL template.
 * @returns {JSX.Element} - SearchBar component.
 */
function SearchBar({ setUrl, searchUrl }) {
    const { dispatch: historyDispatch } = useHistory();
    const [inputValue, setInputValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const checkIfClickedOutside = (e) => {
            if (showDropdown && inputRef.current && !inputRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', checkIfClickedOutside);

        return () => {
            document.removeEventListener('mousedown', checkIfClickedOutside);
        };
    }, [showDropdown]);

    /**
     * Performs the search operation based on the provided name.
     * @param {string} name - The search query name.
     */
    const search = (name) => {
        const url = searchUrl.replace('{name}', name);
        setUrl(url);
    };

    /**
     * Handles the form submission event.
     * Updates the input value, triggers the search, and adds the search query to the history.
     * @param {Object} event - The form submission event.
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        const name = event.target.name.value;
        historyDispatch({ type: 'add', payload: { name } });
        search(name);
        setInputValue(name);
        setShowDropdown(false);
    };

    /**
     * Handles the click event on a history item.
     * Updates the input value, triggers the search, and closes the dropdown.
     * @param {string} name - The history item name.
     */
    const handleHistoryClick = (name) => {
        setInputValue(name);
        search(name);
        setShowDropdown(false);
    };

    /**
     * Handles the click event on the input field.
     * Shows the dropdown.
     */
    const handleInputClick = () => {
        setShowDropdown(true);
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            <form onSubmit={handleSubmit} className="p-3 needs-validation" noValidate>
                <div className="input-group" ref={inputRef}>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="검색..."
                        required
                        value={inputValue}
                        onClick={handleInputClick}
                        onChange={(event) => setInputValue(event.target.value)}
                    />
                    <button type="submit" className="btn btn-light rounded-right">
                        <i className="bi bi-search rounded"></i>
                    </button>
                    {showDropdown && <HistoryList handleHistoryClick={handleHistoryClick} />}
                </div>
            </form>
        </div>
    );
}

export default SearchBar;
