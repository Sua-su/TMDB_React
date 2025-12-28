import React from 'react';

/**
 * Component for pagination.
 * @param {number} currentPage - The current page number.
 * @param {number} totalPages - The total number of pages.
 * @param {Function} handlePageChange - The function to handle page changes.
 * @returns {JSX.Element} - Pagination component.
 */
function Pagination({ currentPage, totalPages, handlePageChange }) {
    // Pagination settings
    const PAGES_TO_SHOW = 7;
    const HALF_PAGES_TO_SHOW = Math.floor(PAGES_TO_SHOW / 2);
    let startPage = currentPage - HALF_PAGES_TO_SHOW;
    let endPage = currentPage + HALF_PAGES_TO_SHOW;

    // Adjust startPage and endPage if they exceed the total page range
    if (startPage <= 0) {
        endPage += Math.abs(startPage) + 1;
        startPage = 1;
    }
    if (endPage > totalPages) {
        startPage -= endPage - totalPages;
        endPage = totalPages;
    }

    // Generate the page range
    const pageRange = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

    return (
        <nav aria-label="...">
            <ul className="pagination grayscale justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <a className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                        Previous
                    </a>
                </li>
                {pageRange.map((page) => (
                    <li className={`page-item ${currentPage === page ? 'active' : ''}`} aria-current="page" key={page}>
                        <a className="page-link" onClick={() => handlePageChange(page)}>
                            {page}
                        </a>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <a className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                        Next
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;
