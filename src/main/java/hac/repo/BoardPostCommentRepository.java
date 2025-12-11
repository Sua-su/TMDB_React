package hac.repo;

import hac.entity.BoardPostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardPostCommentRepository extends JpaRepository<BoardPostComment, Long> {
    List<BoardPostComment> findByPostIdOrderByCreatedAtAsc(Long postId);

    long countByPostId(Long postId);
}
