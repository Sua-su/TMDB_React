import React from 'react';

/**
 * Renders a loading spinner component.
 * @returns {JSX.Element} - The rendered loading spinner component.
 */
function LoadingSpinner() {
    return (
        <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">로딩 중...</span>
            </div>
        </div>
    );
}

export default LoadingSpinner;
