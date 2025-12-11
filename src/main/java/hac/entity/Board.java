package hac.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "boards")
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotEmpty(message = "Board name is mandatory")
    @Column(unique = true, nullable = false)
    private String name; // e.g., "자유게시판", "추천영화"

    @NotEmpty(message = "Board description is mandatory")
    private String description;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("board")
    private List<BoardPost> posts = new ArrayList<>();

    // Constructors
    public Board() {
    }

    public Board(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<BoardPost> getPosts() {
        return posts;
    }

    public void setPosts(List<BoardPost> posts) {
        this.posts = posts;
    }
}
