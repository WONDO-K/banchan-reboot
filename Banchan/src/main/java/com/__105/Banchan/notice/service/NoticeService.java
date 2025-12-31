package com.__105.Banchan.notice.service;

import com.__105.Banchan.notice.dto.*;
import com.__105.Banchan.notice.entitiy.NoticeImage;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;

import java.util.List;

public interface NoticeService {

    void registerNotice(NoticePostRequest requestDto, String username);

    NoticeDetailResponse detailNotice(Long noticeId, String username, boolean isAdmin, boolean isViewed);

    void deleteNotice(Long noticeId, boolean isAdmin, String username);

    void updateNotice(Long noticeId, NoticePostRequest updateRequestDTO, boolean isAdmin, String username);

    Page<NoticeListResponse> getListNotice(SearchCondition searchCondition, String username);

    void registerNoticeComment(Long noticeId, NoticeCommentRequest requestDto, String username);

    List<NoticeCommentResponse> getListNoticeComment(Long noticeId, String username, boolean isAdmin);

    void deleteNoticeComment(Long commentId, boolean isAdmin, String username);

    void updateNoticeComment(Long commentId, NoticeCommentRequest requestDto, String username, boolean isAdmin);

    NoticeImage getNoticeFileById(Long fileId);

    Resource loadFileAsResource(NoticeImage noticeFile);
}
