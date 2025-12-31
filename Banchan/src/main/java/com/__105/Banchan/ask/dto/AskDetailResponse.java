package com.__105.Banchan.ask.dto;

import com.__105.Banchan.user.entity.Apartment;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AskDetailResponse {

    private Long id;
    private String username;
    private Apartment apt;
    private String title;
    private String content;
    private int views;
    private int likes;
    private LocalDateTime createdAt;
    private boolean isAdmin;
    private boolean isWriter;
    private List<AskCommentResponse> comments;
}
