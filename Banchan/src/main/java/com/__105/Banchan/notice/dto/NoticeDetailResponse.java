package com.__105.Banchan.notice.dto;

import com.__105.Banchan.user.entity.Apartment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NoticeDetailResponse {

    private Long id;
    private String username;
    private Apartment apt;
    private String title;
    private String content;
    private int views;
    private LocalDateTime createdAt;
    private boolean isAdmin;
    private boolean isWriter;
    private List<FileDetail> files;

    @Getter
    @Setter
    public static class FileDetail {
        private Long id;
        private String originalFilename;
    }

}
