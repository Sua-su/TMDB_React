import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from './HistoryContext';
import HistoryList from './HistoryList';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Component for searching actors.
 * @param {Object} props - Component props.
 * @param {Function} props.setUrl - Function to set the search URL.
 * @returns {JSX.Element} - SearchActor component.
 */
function SearchActor({ setUrl }) {
    const { dispatch: historyDispatch } = useHistory();
    const [inputValue, setInputValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [searching, setSearching] = useState(false);
    const inputRef = useRef(null);
    const API_KEY = 'c12ed457b94399d3c810d10b94e4e4c5';

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
     * 배우 이름으로 배우 ID를 검색한 후 해당 배우가 출연한 영화를 검색
     * @param {string} actorName - 검색할 배우 이름
     */
    const searchByActorName = async (actorName) => {
        if (!actorName.trim()) return;

        setSearching(true);
        try {
            // 1단계: 배우 이름으로 배우 정보 검색
            const searchResponse = await fetch(
                `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(actorName)}&page=1`
            );
            const searchData = await searchResponse.json();

            if (searchData.results && searchData.results.length > 0) {
                // 첫 번째 검색 결과의 배우 ID 사용
                const actorId = searchData.results[0].id;
                
                // 2단계: 배우 ID로 출연 영화 검색
                const movieUrl = `/discover/movie?include_adult=false&include_video=false&language=ko-KR&page=1&sort_by=popularity.desc&with_cast=${actorId}`;
                setUrl(movieUrl);
                
                historyDispatch({ type: 'add', payload: { name: actorName } });
            } else {
                alert(`"${actorName}" 배우를 찾을 수 없습니다.`);
            }
        } catch (error) {
            console.error('배우 검색 오류:', error);
            alert('배우 검색 중 오류가 발생했습니다.');
        } finally {
            setSearching(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const name = event.target.name.value;
        searchByActorName(name);
        setInputValue(name);
        setShowDropdown(false);
    };

    const handleHistoryClick = (name) => {
        setInputValue(name);
        searchByActorName(name);
        setShowDropdown(false);
    };

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
                        placeholder="배우 이름 검색..."
                        required
                        value={inputValue}
                        onClick={handleInputClick}
                        onChange={(event) => setInputValue(event.target.value)}
                        disabled={searching}
                    />
                    <button type="submit" className="btn btn-light rounded-right" disabled={searching}>
                        <i className="bi bi-search rounded"></i>
                        {searching && <span className="spinner-border spinner-border-sm ms-1" />}
                    </button>
                    {showDropdown && <HistoryList handleHistoryClick={handleHistoryClick} />}
                </div>
            </form>
        </div>
    );
}

export default SearchActor;
