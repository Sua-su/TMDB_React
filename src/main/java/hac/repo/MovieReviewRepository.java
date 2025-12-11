package hac.repo;

import hac.entity.MovieReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieReviewRepository extends JpaRepository<MovieReview, Long> {
    List<MovieReview> findByMovieIdOrderByCreatedAtDesc(Long movieId);

    List<MovieReview> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<MovieReview> findAllByOrderByCreatedAtDesc();
}
