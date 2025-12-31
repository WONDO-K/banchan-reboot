package com.__105.Banchan.ask.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AskListResponse {

    private Long id;
    private String title;
    private String content;
    private String username;
    private int views;
    private Long likes;
    private LocalDateTime createdAt;
}
