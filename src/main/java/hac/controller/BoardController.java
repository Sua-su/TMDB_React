package hac.controller;

import hac.entity.*;
import hac.repo.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private BoardPostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BoardPostCommentRepository commentRepository;

    @Autowired
    private BoardPostLikeRepository likeRepository;

    @GetMapping
    public ResponseEntity<List<Board>> getAllBoards() {
        return ResponseEntity.ok(boardRepository.findAll());
    }

    @GetMapping("/{boardId}/posts")
    public ResponseEntity<List<BoardPost>> getPostsByBoard(@PathVariable Long boardId) {
        List<BoardPost> posts = postRepository.findByBoardIdOrderByCreatedAtDesc(boardId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<?> getPost(@PathVariable Long postId) {
        return postRepository.findById(postId)
                .map(post -> {
                    post.incrementViewCount();
                    postRepository.save(post);
                    return ResponseEntity.ok(post);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{boardId}/posts")
    public ResponseEntity<?> createPost(@PathVariable Long boardId, @Valid @RequestBody BoardPost post) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));

        post.setAuthor(user);
        post.setBoard(board);
        BoardPost savedPost = postRepository.save(post);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
    }

    @PutMapping("/posts/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable Long postId, @Valid @RequestBody BoardPost updatedPost) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return postRepository.findById(postId)
                .map(post -> {
                    if (!post.getAuthor().getUsername().equals(username)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(Map.of("error", "You can only edit your own posts"));
                    }

                    post.setTitle(updatedPost.getTitle());
                    post.setContent(updatedPost.getContent());
                    BoardPost saved = postRepository.save(post);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return postRepository.findById(postId)
                .map(post -> {
                    if (!post.getAuthor().getUsername().equals(username)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(Map.of("error", "You can only delete your own posts"));
                    }

                    postRepository.delete(post);
                    return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Comment endpoints
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<BoardPostComment>> getComments(@PathVariable Long postId) {
        List<BoardPostComment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<?> createComment(@PathVariable Long postId, @RequestBody Map<String, String> request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BoardPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        BoardPostComment comment = new BoardPostComment();
        comment.setPost(post);
        comment.setAuthor(user);
        comment.setContent(request.get("content"));

        BoardPostComment savedComment = commentRepository.save(comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return commentRepository.findById(commentId)
                .map(comment -> {
                    if (!comment.getAuthor().getUsername().equals(username)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(Map.of("error", "You can only delete your own comments"));
                    }
                    commentRepository.delete(comment);
                    return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Like endpoints
    @GetMapping("/posts/{postId}/likes")
    public ResponseEntity<?> getLikes(@PathVariable Long postId) {
        long likeCount = likeRepository.countByPostId(postId);
        boolean userLiked = false;

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getName())) {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null) {
                userLiked = likeRepository.existsByPostIdAndUserId(postId, user.getId());
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("likeCount", likeCount);
        response.put("userLiked", userLiked);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BoardPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        var existingLike = likeRepository.findByPostIdAndUserId(postId, user.getId());

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            long likeCount = likeRepository.countByPostId(postId);
            return ResponseEntity.ok(Map.of("liked", false, "likeCount", likeCount));
        } else {
            BoardPostLike like = new BoardPostLike(post, user);
            likeRepository.save(like);
            long likeCount = likeRepository.countByPostId(postId);
            return ResponseEntity.ok(Map.of("liked", true, "likeCount", likeCount));
        }
    }

    // Admin endpoint to initialize boards
    @PostMapping("/init")
    public ResponseEntity<?> initializeBoards() {
        if (boardRepository.count() == 0) {
            boardRepository.save(new Board("자유게시판", "자유롭게 이야기를 나누는 공간입니다"));
            boardRepository.save(new Board("추천영화", "재미있게 본 영화를 추천해주세요"));
            boardRepository.save(new Board("질문게시판", "궁금한 것을 물어보세요"));
            return ResponseEntity.ok(Map.of("message", "Boards initialized successfully"));
        }
        return ResponseEntity.ok(Map.of("message", "Boards already exist"));
    }
}
