import React from 'react';
import { useHistory } from './HistoryContext';

/**
 * Component for rendering the history list of search items.
 * @param {Object} props - Component props.
 * @param {Function} props.handleHistoryClick - Function to handle click on a history item.
 * @returns {JSX.Element} - HistoryList component.
 */
export default function HistoryList({ handleHistoryClick }) {
    const { state, dispatch } = useHistory();

    const clearHistory = () => {
        dispatch({ type: 'clear' });
    };

    const handleDelete = (index) => {
        dispatch({ type: 'remove', payload: index });
    };

    /**
     * Component for rendering an individual history item.
     * @param {Object} props - Component props.
     * @param {number} props.index - The index of the history item.
     * @param {Object} props.item - The history item object.
     * @returns {JSX.Element} - HistoryItem component.
     */
    const HistoryItem = ({ index, item }) => (
        <div
            className="dropdown-item d-flex justify-content-between rounded"
            key={index}
            onClick={() => handleHistoryClick(item.name)}
        >
            <span>{item.name}</span>
            <button
                className="btn btn-link text-secondary p-0"
                onClick={(event) => {
                    event.stopPropagation();
                    handleDelete(index);
                }}
            >
                <i className="bi bi-x-circle"></i>
            </button>
        </div>
    );

    return (
        state.length > 0 && (
            <div className="dropdown-item">
                <div className="input-group dropdown-menu show">
                    <button className="btn" onClick={clearHistory}>
                        <i className="bi bi-trash"></i>
                    </button>
                    {state.map((item, index) => (
                        <HistoryItem key={index} index={index} item={item} />
                    ))}
                </div>
            </div>
        )
    );
}
