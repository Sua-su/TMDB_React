import React from 'react';
import useFetchMovies from '../searchStates/useFetchMovies';
import CategoryRow from '../Movies/CategoryRow';

/**
 * Component for the home page.
 * @returns {JSX.Element} - Home component.
 */
function Home() {
    const categories = [
        { url: '/discover/movie?sort_by=popularity.desc', name: '인기 영화' },
        { url: '/discover/movie?sort_by=vote_average.desc', name: '높은 평점 영화' },
        { url: '/discover/movie?primary_release_year=2024', name: '2024년 개봉 영화' },
        { url: '/discover/movie?with_genres=35', name: '코미디 영화' }
    ];

    const category1 = useFetchMovies(categories[0].url, 1);
    const category2 = useFetchMovies(categories[1].url, 1);
    const category3 = useFetchMovies(categories[2].url, 1);
    const category4 = useFetchMovies(categories[3].url, 1);

    const allCategories = [category1, category2, category3, category4];

    return (
        <div className="container">
            {allCategories.map((category, index) => (
                <CategoryRow
                    key={index}
                    movies={category.movies}
                    loading={category.loading}
                    error={category.error}
                    categoryName={categories[index].name}
                    categoryIndex={index}
                />
            ))}
        </div>
    );
}

export default Home;
