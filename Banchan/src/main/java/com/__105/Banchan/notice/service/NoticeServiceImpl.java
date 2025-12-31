package com.__105.Banchan.notice.service;

import com.__105.Banchan.notice.dto.*;
import com.__105.Banchan.notice.entitiy.Notice;
import com.__105.Banchan.notice.entitiy.NoticeComment;
import com.__105.Banchan.notice.entitiy.NoticeImage;
import com.__105.Banchan.notice.exception.NoticeErrorCode;
import com.__105.Banchan.notice.exception.NoticeException;
import com.__105.Banchan.notice.repository.NoticeCommentRepository;
import com.__105.Banchan.notice.repository.NoticeImageRepository;
import com.__105.Banchan.notice.repository.NoticeRepository;
import com.__105.Banchan.notice.repository.NoticeSpecification;
import com.__105.Banchan.user.entity.Apartment;
import com.__105.Banchan.user.entity.User;
import com.__105.Banchan.user.entity.UserApartment;
import com.__105.Banchan.user.enums.Role;
import com.__105.Banchan.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;
    private final NoticeCommentRepository noticeCommentRepository;
    private final NoticeImageRepository noticeImageRepository;

    @Value("${file.upload-dir}")
    private String fileUploadPath;

    @Override
    public void registerNotice(NoticePostRequest requestDto, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NoticeException(NoticeErrorCode.USER_NOT_FOUND));

        Apartment apt = user.getUserApartments()
                .stream()
                .findFirst()
                .orElseThrow(() -> new NoticeException(NoticeErrorCode.APARTMENT_NOT_FOUND))
                .getApartment();

        Notice notice = Notice.builder()
                .user(user)
                .apartment(apt)
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .build();

        noticeRepository.save(notice);

        List<MultipartFile> files = requestDto.getFiles();
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                String originalFilename = file.getOriginalFilename();
                String storedFileName  = saveFile(file);

                NoticeImage noticeImage = NoticeImage.builder()
                        .notice(notice)
                        .originalFilename(originalFilename)
                        .storedFilename(storedFileName)
                        .imageUrl(fileUploadPath + "/" + storedFileName)
                        .build();

                noticeImageRepository.save(noticeImage);
            }
        }
    }

    private String saveFile(MultipartFile file) {

        try {
            String originalFileName  = file.getOriginalFilename();
            String storedFileName = UUID.randomUUID().toString() + "_" + originalFileName;
            Path filePath = Paths.get(fileUploadPath, storedFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return storedFileName;
        } catch (IOException e) {
            throw new NoticeException(NoticeErrorCode.FILE_STORAGE_FAILED);
        }
    }

    @Override
    public NoticeDetailResponse detailNotice(Long noticeId, String username, boolean isAdmin, boolean isViewed) {

        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new NoticeException(NoticeErrorCode.NOTICE_NOT_FOUND));

        if (!isViewed) {
            notice.increaseViews();
        }

        NoticeDetailResponse responseDto = new NoticeDetailResponse();
        responseDto.setId(noticeId);
        responseDto.setUsername(notice.getUser().getUsername());
        responseDto.setApt(notice.getApartment());
        responseDto.setTitle(notice.getTitle());
        responseDto.setContent(notice.getContent());
        responseDto.setCreatedAt(notice.getCreatedAt());
        responseDto.setViews(notice.getViews());
        responseDto.setAdmin(isAdmin);
        responseDto.setWriter(notice.getUser().getUsername().equals(username));

        List<NoticeImage> noticeFiles = noticeImageRepository.findAllByNotice(notice);
        List<NoticeDetailResponse.FileDetail> fileDetails = noticeFiles.stream()
                .map(file -> {
                    NoticeDetailResponse.FileDetail fileDetail = new NoticeDetailResponse.FileDetail();
                    fileDetail.setId(file.getId());
                    fileDetail.setOriginalFilename(file.getOriginalFilename());
                    return fileDetail;
                })
                .collect(Collectors.toList());

        responseDto.setFiles(fileDetails);

        return responseDto;
    }

    @Override
    public void deleteNotice(Long noticeId, boolean isAdmin, String username) {

        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new NoticeException(NoticeErrorCode.NOTICE_NOT_FOUND));

        if (!notice.getUser().getUsername().equals(username) && !isAdmin) {
            throw new NoticeException(NoticeErrorCode.UNAUTHORIZED_ACTION);
        }

        List<NoticeComment> comments = noticeCommentRepository.findAllByNotice(notice);
        List<NoticeImage> images = noticeImageRepository.findAllByNotice(notice);

        if(!comments.isEmpty()) {
            noticeCommentRepository.deleteAll(comments);
        }

        if (!images.isEmpty()) {
            noticeImageRepository.deleteAll(images);
        }

        noticeRepository.delete(notice);
    }

    @Override
    public void updateNotice(Long noticeId, NoticePostRequest updateRequestDTO, boolean isAdmin, String username) {

        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new NoticeException(NoticeErrorCode.NOTICE_NOT_FOUND));

        if (!notice.getUser().getUsername().equals(username) && !isAdmin) {
            throw new NoticeException(NoticeErrorCode.UNAUTHORIZED_ACTION);
        }

        notice = notice.toBuilder()
                .title(updateRequestDTO.getTitle())
                .content(updateRequestDTO.getContent())
                .build();

        noticeRepository.save(notice);
    }

    @Override
    public Page<NoticeListResponse> getListNotice(SearchCondition requestDTO, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NoticeException(NoticeErrorCode.USER_NOT_FOUND));

        Set<UserApartment> ua = user.getUserApartments();

        if (ua.isEmpty()) {
            throw new NoticeException(NoticeErrorCode.APARTMENT_NOT_FOUND);
        }

        String aptCode = ua.stream().findFirst()
                .orElseThrow(() -> new NoticeException(NoticeErrorCode.APARTMENT_NOT_FOUND))
                .getApartment().getCode();

        Specification<Notice> spec = Specification.where(null);
        spec = spec.and(NoticeSpecification.whereApt(aptCode));

        if (requestDTO.getKeyword() != null && !requestDTO.getKeyword().isEmpty()) {
            spec = spec.and(NoticeSpecification.containsKeyword(requestDTO.getKeyword()));
        }

        Sort sort = Sort.by(Sort.Direction.fromString(requestDTO.getSortDirection()), requestDTO.getSortBy());
        Pageable pageable = PageRequest.of(requestDTO.getPage(), requestDTO.getSize(), sort);

        Page<Notice> noticePage = noticeRepository.findAll(spec, pageable);

        List<NoticeListResponse> noticeList = noticePage.getContent().stream().map(notice ->
                NoticeListResponse.builder()
                        .id(notice.getId())
                        .title(notice.getTitle())
                        .content(notice.getContent())
                        .username(notice.getUser().getUsername())
                        .views(notice.getViews())
                        .createdAt(notice.getCreatedAt())
                        .build()
        ).collect(Collectors.toList());

        return new PageImpl<>(noticeList, pageable, noticePage.getTotalElements());
    }

    @Override
    public void registerNoticeComment(Long noticeId, NoticeCommentRequest requestDto, String username) {

        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new NoticeException(NoticeErrorCode.NOTICE_NOT_FOUND));

        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new NoticeException(NoticeErrorCode.USER_NOT_FOUND));

        NoticeComment noticeComment = NoticeComment.builder()
                .notice(notice)
                .user(user)
                .content(requestDto.getContent())
                .build();

        noticeCommentRepository.save(noticeComment);
    }

    @Override
    public List<NoticeCommentResponse> getListNoticeComment(Long noticeId, String username, boolean isAdmin) {

        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new NoticeException(NoticeErrorCode.NOTICE_NOT_FOUND));

        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new NoticeException(NoticeErrorCode.USER_NOT_FOUND));

        List<NoticeComment> comments = noticeCommentRepository.findAllByNotice(notice);

        return comments.stream().map(comment -> {
            NoticeCommentResponse commentResponse = new NoticeCommentResponse();
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
    public void deleteNoticeComment(Long commentId, boolean isAdmin, String username) {

        NoticeComment noticeComment = noticeCommentRepository.findById(commentId)
                .orElseThrow(() -> new NoticeException(NoticeErrorCode.COMMENT_NOT_FOUND));

        if(!noticeComment.getUser().getUsername().equals(username) && !isAdmin) {
            throw new NoticeException(NoticeErrorCode.UNAUTHORIZED_ACTION);
        }

        noticeCommentRepository.delete(noticeComment);
    }

    @Override
    public void updateNoticeComment(Long commentId, NoticeCommentRequest requestDto, String username, boolean isAdmin) {

        NoticeComment noticeComment = noticeCommentRepository.findById(commentId)
                .orElseThrow(() -> new NoticeException(NoticeErrorCode.COMMENT_NOT_FOUND));

        if (!noticeComment.getUser().getUsername().equals(username) && !isAdmin) {
            throw new NoticeException(NoticeErrorCode.UNAUTHORIZED_ACTION);
        }

        noticeComment = noticeComment.toBuilder()
                .content(requestDto.getContent())
                .build();

        noticeCommentRepository.save(noticeComment);
    }

    @Override
    public NoticeImage getNoticeFileById(Long fileId) {
        return noticeImageRepository.findById(fileId)
                .orElseThrow(() -> new NoticeException(NoticeErrorCode.FILE_NOT_FOUND));
    }

    @Override
    public Resource loadFileAsResource(NoticeImage noticeFile) {

        try {
            Path filePath = Paths.get(noticeFile.getImageUrl());
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new NoticeException(NoticeErrorCode.FILE_NOT_FOUND);
            }
        } catch (IOException ex) {
            throw new NoticeException(NoticeErrorCode.FILE_NOT_FOUND);
        }
    }
}
