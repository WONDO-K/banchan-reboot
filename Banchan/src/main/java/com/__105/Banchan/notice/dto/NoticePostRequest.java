package com.__105.Banchan.notice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NoticePostRequest {

    private String title;
    private String content;

    // 파일첨부를 위한 필드
    private List<MultipartFile> files;

}
