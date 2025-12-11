package hac.repo;

import hac.entity.BoardPostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardPostLikeRepository extends JpaRepository<BoardPostLike, Long> {
    Optional<BoardPostLike> findByPostIdAndUserId(Long postId, Long userId);

    long countByPostId(Long postId);

    boolean existsByPostIdAndUserId(Long postId, Long userId);
}
