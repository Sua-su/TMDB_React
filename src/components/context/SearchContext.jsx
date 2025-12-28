import React, { createContext, useReducer, useContext } from 'react';

/**
 * Context to manage the search state.
 */
const SearchStateContext = createContext();

/**
 * Initial state for the search state.
 */
const initialState = { search: '', genre: '', date: '', actor: '' };

/**
 * Reducer function for the search state.
 * @param {Object} state - The current state.
 * @param {Object} action - The action object.
 * @returns {Object} - The new state.
 */
function reducer(state, action) {
    switch (action.type) {
        case 'updateSearch':
            return { ...state, search: action.payload };
        case 'updateGenre':
            return { ...state, genre: action.payload };
        case 'updateDate':
            return { ...state, date: action.payload };
        case 'updateActor':
            return { ...state, actor: action.payload };
        default:
            throw new Error();
    }
}

/**
 * Provider component for the SearchStateContext.
 * @param {Object} children - The child components.
 * @returns {JSX.Element} - The rendered SearchProvider component.
 */
export function SearchProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <SearchStateContext.Provider value={{ state, dispatch }}>
            {children}
        </SearchStateContext.Provider>
    );
}

/**
 * Custom hook to access the search state.
 * @returns {Object} - The search state and dispatch function.
 */
export function useSearchState() {
    const context = useContext(SearchStateContext);
    if (context === undefined) {
        throw new Error('useSearchState must be used within a SearchProvider');
    }
    return context;
}
