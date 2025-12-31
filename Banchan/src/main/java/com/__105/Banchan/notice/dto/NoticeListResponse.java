package com.__105.Banchan.notice.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class NoticeListResponse {

    private Long id;
    private String title;
    private String content;
    private String username;
    private int views;
    private LocalDateTime createdAt;
}
