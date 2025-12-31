package com.__105.Banchan.ask.servie;

import com.__105.Banchan.ask.dto.*;
import com.__105.Banchan.ask.entity.*;
import com.__105.Banchan.ask.exception.AskErrorCode;
import com.__105.Banchan.ask.exception.AskException;
import com.__105.Banchan.ask.repository.*;
import com.__105.Banchan.notice.dto.SearchCondition;
import com.__105.Banchan.user.entity.Apartment;
import com.__105.Banchan.user.entity.User;
import com.__105.Banchan.user.entity.UserApartment;
import com.__105.Banchan.user.enums.Role;
import com.__105.Banchan.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AskServiceImpl implements AskService {

    private final AskRepository askRepository;
    private final AskCommentRepository askCommentRepository;
    private final UserRepository userRepository;
    private final AskLikeRepository askLikeRepository;
    private final AskImageRepository askImageRepository;

    @Override
    public void registAsk(AskPostRequest requestDto, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AskException(AskErrorCode.USER_NOT_FOUND));

        Set<UserApartment> ua = user.getUserApartments();

        if (ua.isEmpty()) {
            throw new AskException(AskErrorCode.APARTMENT_NOT_FOUND);
        }

        Apartment apt = ua.stream()
                .findFirst()
                .orElseThrow(() -> new AskException(AskErrorCode.APARTMENT_NOT_FOUND))
                .getApartment();

        Ask ask = Ask.builder()
                .user(user)
                .apt(apt)
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .build();

        askRepository.save(ask);
    }

    @Override
    public AskDetailResponse detailAsk(Long askId, String username, boolean isAdmin, boolean isViewed) {

        Ask ask = askRepository.findById(askId)
                .orElseThrow(() -> new AskException(AskErrorCode.ASK_NOT_FOUND));

        if (!isViewed) {
            ask.updateViews();
        }

        int likes = askLikeRepository.countByAskId(ask.getId());

        return AskDetailResponse.builder()
                .id(askId)
                .username(ask.getUser().getUsername())
                .apt(ask.getApt())
                .title(ask.getTitle())
                .content(ask.getContent())
                .createdAt(ask.getCreatedAt())
                .views(ask.getViews())
                .likes(likes)
                .isAdmin(isAdmin)
                .isWriter(ask.getUser().getUsername().equals(username))
                .build();
    }

    @Override
    public void deleteAsk(Long askId, boolean isAdmin, String username) {

        Ask ask = askRepository.findById(askId)
                .orElseThrow(() -> new AskException(AskErrorCode.ASK_NOT_FOUND));

        if (!ask.getUser().getUsername().equals(username) && !isAdmin) {
            throw new AskException(AskErrorCode.UNAUTHORIZED_ACTION);
        }

        List<AskImage> images = askImageRepository.findAllByAsk(ask);
        List<AskComment> comments = askCommentRepository.findAllByAsk(ask);
        List<AskLike> likes = askLikeRepository.findAll();

        if (!images.isEmpty()) askImageRepository.deleteAll(images);
        if (!comments.isEmpty()) askCommentRepository.deleteAll(comments);
        if (!likes.isEmpty()) askLikeRepository.deleteAll(likes);

        askRepository.delete(ask);
    }

    @Override
    public void updateAsk(Long askId, AskPostRequest requestDto, boolean isAdmin, String username) {

        Ask ask = askRepository.findById(askId)
                .orElseThrow(() -> new AskException(AskErrorCode.ASK_NOT_FOUND));

        if (!ask.getUser().getUsername().equals(username) && !isAdmin) {
            throw new AskException(AskErrorCode.UNAUTHORIZED_ACTION);
        }

        ask = ask.toBuilder()
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .build();

        askRepository.save(ask);
    }

    @Override
    public Page<AskListResponse> getListAsk(SearchCondition searchCondition, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AskException(AskErrorCode.USER_NOT_FOUND));

        Set<UserApartment> ua = user.getUserApartments();

        if (ua.isEmpty()) {
            throw new AskException(AskErrorCode.APARTMENT_NOT_FOUND);
        }

        String aptCode = ua.stream()
                .findFirst()
                .orElseThrow(() -> new AskException(AskErrorCode.APARTMENT_NOT_FOUND))
                .getApartment().getCode();

        Specification<Ask> spec = Specification.where(null);
        spec = spec.and(AskSpecification.whereApt(aptCode));

        if (user.getRole() != Role.ADMIN) {
            spec = spec.and(AskSpecification.wherUser(user.getId()));
        }

        if (searchCondition.getKeyword() != null && !searchCondition.getKeyword().isEmpty()) {
            spec = spec.and(AskSpecification.containsKeyword(searchCondition.getKeyword()));
        }

        Sort sort = Sort.by(Sort.Direction.fromString(searchCondition.getSortDirection()), searchCondition.getSortBy());
        Pageable pageable = PageRequest.of(searchCondition.getPage(), searchCondition.getSize(), sort);

        Page<Ask> askPage = askRepository.findAll(spec, pageable);

        List<Long> askIds = askPage.getContent().stream()
                .map(Ask::getId)
                .collect(Collectors.toList());

        List<Object[]> results = askLikeRepository.countLikesByAskIds(askIds);
        Map<Long, Long> likesCountMap = results.stream()
                .collect(Collectors.toMap(
                        result -> (Long) result[0],  // ask_id (Long)
                        result -> (Long) result[1]   // like count (Long)
                ));


        List<AskListResponse> askList = askPage.getContent().stream().map(ask ->
                AskListResponse.builder()
                        .id(ask.getId())
                        .title(ask.getTitle())
                        .content(ask.getContent())
                        .username(ask.getUser().getUsername())
                        .views(ask.getViews())
                        .likes(likesCountMap.getOrDefault(ask.getId(), 0L))
                        .createdAt(ask.getCreatedAt())
                        .build()
        ).collect(Collectors.toList());

        return new PageImpl<>(askList, pageable, askPage.getTotalElements());
    }

    @Override
    public void registAskComment(Long askId, AskCommentRequest requestDto, String username) {

        Ask ask = askRepository.findById(askId)
                .orElseThrow(() -> new AskException(AskErrorCode.ASK_NOT_FOUND));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AskException(AskErrorCode.USER_NOT_FOUND));

        AskComment askComment = AskComment.builder()
                .ask(ask)
                .user(user)
                .content(requestDto.getContent())
                .build();

        askCommentRepository.save(askComment);
    }

    @Override
    public List<AskCommentResponse> getListAskComment(Long askId, String username, boolean isAdmin) {

        Ask ask = askRepository.findById(askId)
                .orElseThrow(() -> new AskException(AskErrorCode.ASK_NOT_FOUND));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AskException(AskErrorCode.USER_NOT_FOUND));

        List<AskComment> comments = askCommentRepository.findAllByAsk(ask);

        return comments.stream().map(comment -> {
            AskCommentResponse commentResponse = new AskCommentResponse();
            commentResponse.setId(comment.getId());
            commentResponse.setUsername(comment.getUser().getUsername());
            commentResponse.setContent(comment.getContent());
            commentResponse.setCreatedAt(comment.getCreatedAt());
            commentResponse.setAdmin(isAdmin);
            commentResponse.setWriter(comment.getUser().getUsername().equals(username));
            return commentResponse;
        }).collect(Collectors.toList());
    }

    @Override
    public void deleteAskComment(Long commentId, boolean isAdmin, String username) {

        AskComment askComment = askCommentRepository.findById(commentId)
                .orElseThrow(() -> new AskException(AskErrorCode.COMMENT_NOT_FOUND));

        if (!askComment.getUser().getUsername().equals(username) && !isAdmin) {
            throw new AskException(AskErrorCode.UNAUTHORIZED_ACTION);
        }

        askCommentRepository.delete(askComment);
    }


    @Override
    public void updateAskComment(Long commentId, AskCommentRequest requestDto, String username, boolean isAdmin) {

        AskComment askComment = askCommentRepository.findById(commentId)
                .orElseThrow(() -> new AskException(AskErrorCode.COMMENT_NOT_FOUND));

        if (!askComment.getUser().getUsername().equals(username) && !isAdmin) {
            throw new AskException(AskErrorCode.UNAUTHORIZED_ACTION);
        }

        askComment = askComment.toBuilder()
                .content(requestDto.getContent())
                .build();

        askCommentRepository.save(askComment);
    }

    @Override
    public void likeAsk(Long askId, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AskException(AskErrorCode.USER_NOT_FOUND));

        Ask ask = askRepository.findById(askId)
                .orElseThrow(() -> new AskException(AskErrorCode.ASK_NOT_FOUND));

        AskLikeId askLikeId = AskLikeId.builder()
                .user(user.getId())
                .ask(askId)
                .build();

        if (!askLikeRepository.existsById(askLikeId)) {

            AskLike askLike = AskLike.builder()
                    .id(askLikeId)
                    .ask(ask)
                    .user(user)
                    .build();

            askLikeRepository.save(askLike);
        }

    }

    @Override
    public void unlikeAsk(Long askId, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AskException(AskErrorCode.USER_NOT_FOUND));

        AskLikeId askLikeId = AskLikeId.builder()
                .user(user.getId())
                .ask(askId)
                .build();

        if (askLikeRepository.existsById(askLikeId)) {
            askLikeRepository.deleteById(askLikeId);
        }
    }
}
