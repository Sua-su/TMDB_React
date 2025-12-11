package hac.repo;

import hac.entity.BoardPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardPostRepository extends JpaRepository<BoardPost, Long> {
    List<BoardPost> findByBoardIdOrderByCreatedAtDesc(Long boardId);

    List<BoardPost> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
}
