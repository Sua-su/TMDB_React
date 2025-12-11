import React from 'react';

/**
 * Component for selecting a date and updating the search URL.
 * @param {Object} props - Component props.
 * @param {Function} props.setUrl - Function to set the search URL.
 * @returns {JSX.Element} - DatePick component.
 */
function DatePick({ setUrl }) {
    const handleSubmit = (event) => {
        event.preventDefault();
        const date = event.target.date.value;
        const API_BASE_URL = '/discover/movie';
        const INCLUDE_ADULT = false;
        const INCLUDE_VIDEO = false;
        const LANGUAGE = 'ko-KR';
        const PAGE = 1;
        const SORT_BY = 'popularity.desc';
        const URL = `${API_BASE_URL}?include_adult=${INCLUDE_ADULT}&include_video=${INCLUDE_VIDEO}&language=${LANGUAGE}&page=${PAGE}&sort_by=${SORT_BY}&primary_release_date.gte=${date}&primary_release_date.lte=${date}`;

        setUrl(URL);
    };

    return (
        <form className="row g-3 p-3 justify-content-center grayscale" onSubmit={handleSubmit}>
            <div className="col-auto">
                <input name="date" type="date" className="form-control" />
            </div>
            <div className="col-auto">
                <button type="submit" className="btn btn-primary mb-3">검색</button>
            </div>
        </form>
    );
}

export default DatePick;
