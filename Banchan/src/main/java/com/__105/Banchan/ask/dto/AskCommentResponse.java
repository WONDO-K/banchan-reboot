package com.__105.Banchan.ask.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AskCommentResponse {

    private Long id;
    private String username;
    private String content;
    private LocalDateTime createdAt;
    private boolean isAdmin;
    private boolean isWriter;
}


