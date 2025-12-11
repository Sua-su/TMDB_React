import React, { createContext, useContext, useReducer } from 'react';

/**
 * Context for managing search history state and dispatch.
 */
const HistoryContext = createContext();

const initialState = [];

/**
 * Reducer function for managing search history state.
 * @param {Array} state - Current state.
 * @param {Object} action - Action object.
 * @param {string} action.type - Action type.
 * @param {*} action.payload - Action payload.
 * @returns {Array} - New state.
 */
function historyReducer(state, action) {
    switch (action.type) {
        case 'add':
            return [...state, action.payload];
        case 'remove':
            return state.filter((_, index) => index !== action.payload);
        case 'clear':
            return [];
        default:
            throw new Error('Unsupported action type');
    }
}

/**
 * Provider component for the search history context.
 * @param {Object} props - Component props.
 * @param {ReactNode} props.children - Child components.
 * @returns {JSX.Element} - HistoryProvider component.
 */
export function HistoryProvider({ children }) {
    const [state, dispatch] = useReducer(historyReducer, initialState);

    return (
        <HistoryContext.Provider value={{ state, dispatch }}>
            {children}
        </HistoryContext.Provider>
    );
}

/**
 * Hook for accessing the search history context.
 * @returns {Object} - History context.
 */
export function useHistory() {
    const context = useContext(HistoryContext);
    if (context === undefined) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
}
