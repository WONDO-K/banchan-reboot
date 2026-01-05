package com.__105.Banchan.ask.service;

import com.__105.Banchan.ask.dto.*;
import com.__105.Banchan.notice.dto.SearchCondition;
import org.springframework.data.domain.Page;

import java.util.List;

public interface AskService {

    void registAsk(AskPostRequest requestDto, String username);

    AskDetailResponse detailAsk(Long askId, String username, boolean isAdmin, boolean isViewed);

    void deleteAsk(Long askId, boolean isAdmin, String username);

    void updateAsk(Long askId, AskPostRequest requestDto, boolean isAdmin, String username);

    Page<AskListResponse> getListAsk(SearchCondition searchCondition, String username);

    void registAskComment(Long askId, AskCommentRequest requestDto, String username);

    List<AskCommentResponse> getListAskComment(Long askId, String username, boolean isAdmin);

    void deleteAskComment(Long commentId, boolean isAdmin, String username);

    void updateAskComment(Long commentId, AskCommentRequest requestDto, String username, boolean isAdmin);

    void likeAsk(Long askId, String username);

    void unlikeAsk(Long askId, String username);
}
