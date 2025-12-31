package com.__105.Banchan.notice.controller;

import com.__105.Banchan.notice.dto.*;
import com.__105.Banchan.notice.entitiy.NoticeImage;
import com.__105.Banchan.notice.service.NoticeService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/notice")
public class  NoticeController {

    private final NoticeService noticeService;

    // 공지사항 등록
    @PostMapping("/regist")
    @Operation(summary = "공지사항 등록", description = "공지사항을 등록합니다.")
    public ResponseEntity<?> registerNotice(@ModelAttribute NoticePostRequest postRequestDTO,
                                            @AuthenticationPrincipal UserDetails userDetails) {

        noticeService.registerNotice(postRequestDTO, userDetails.getUsername());

        return ResponseEntity.ok().body("Notice registered successfully");
    }

    /*
     * 게시글 상세 조회 시 HttpCookie 설정을 통하여 10분동안 동일한 게시글에 대해서 조회수 업데이트 X
     * */
    @GetMapping("detail/{noticeId}")
    @Operation(summary = "공지사항 상세 조회", description = "공지사항 상세 정보를 조회합니다.")
    public ResponseEntity<?> detailNotice(@PathVariable Long noticeId,
                                          @AuthenticationPrincipal UserDetails userDetails,
                                          HttpServletRequest request,
                                          HttpServletResponse response) {

        boolean isAdmin = false;
        boolean isViewed = false;

        if (userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
            isAdmin = true;
        }

        // 쿠키를 통해 최근 조회했던 게시글 조회수 고정하는 로직입니다!
        // Cookie가 아무것도 없을 경우에 NPE 발생 가능성 존재하므로 null 예외 처리
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            cookies = new Cookie[0];
        }

        Optional<Cookie> noticeCookie = Arrays.stream(cookies)
                .filter(cookie -> cookie.getName().equals("viewed_notices"))
                .findFirst();

        if (noticeCookie.isPresent()) {
            String decodedValue = new String(Base64.getDecoder().decode(noticeCookie.get().getValue()));
            String[] viewedNotices = decodedValue.split(",");
            isViewed = Arrays.asList(viewedNotices).contains(noticeId.toString());
        }

        NoticeDetailResponse noticeDto;

        if (!isViewed) {
            String newCookieValue = noticeCookie.map(cookie -> new String(Base64.getDecoder().decode(cookie.getValue())) + "," + noticeId)
                    .orElse(noticeId.toString());
            String encodedValue = Base64.getEncoder().encodeToString(newCookieValue.getBytes());
            Cookie newCookie = new Cookie("viewed_notices", encodedValue);

            newCookie.setPath("/");
            newCookie.setMaxAge(60 * 10);
            response.addCookie(newCookie);

            noticeDto = noticeService.detailNotice(noticeId, userDetails.getUsername(), isAdmin, false);
        } else {
            noticeDto = noticeService.detailNotice(noticeId, userDetails.getUsername(), isAdmin, true);
        }

        return ResponseEntity.ok().body(noticeDto);
    }

    @DeleteMapping("/delete/{noticeId}")
    @Operation(summary = "공지사항 삭제", description = "공지사항을 삭제합니다.")
    public ResponseEntity<?> deleteNotice(@PathVariable Long noticeId,
                                          @AuthenticationPrincipal UserDetails userDetails) {

        boolean isAdmin = false;

        if (userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
            isAdmin = true;
        }

        noticeService.deleteNotice(noticeId, isAdmin, userDetails.getUsername());

        return ResponseEntity.ok().body("Notice deleted successfully");
    }

    @PutMapping("/update/{noticeId}")
    @Operation(summary = "공지사항 수정", description = "공지사항을 수정합니다.")
    public ResponseEntity<?> updateNotice(@PathVariable Long noticeId,
                                          @RequestBody NoticePostRequest updateRequestDTO,
                                          @AuthenticationPrincipal UserDetails userDetails) {

        boolean isAdmin = false;

        if (userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
            isAdmin = true;
        }

        noticeService.updateNotice(noticeId, updateRequestDTO, isAdmin, userDetails.getUsername());

        return ResponseEntity.ok().body("Notice updated successfully");
    }

    @GetMapping("/list")
    @Operation(summary = "공지사항 목록 조회", description = "공지사항 목록을 조회합니다.")
    public ResponseEntity<?> listNotices(@AuthenticationPrincipal UserDetails userDetails,
                                         @RequestParam(required = false) String keyword,
                                         @RequestParam(defaultValue = "createdAt") String sortBy,
                                         @RequestParam(defaultValue = "desc") String sortDirection,
                                         @RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "10") int size) {

        SearchCondition searchCondition = SearchCondition.builder()
                .keyword(keyword)
                .sortBy(sortBy)
                .sortDirection(sortDirection)
                .page(page)
                .size(size)
                .build();

        Page<NoticeListResponse> notices = noticeService.getListNotice(searchCondition, userDetails.getUsername());
        return ResponseEntity.ok(notices);
    }

    @PostMapping("/comment/regist/{noticeId}")
    @Operation(summary = "댓글 등록", description = "댓글을 등록합니다.")
    public ResponseEntity<?> registerComment(@RequestBody NoticeCommentRequest requestDto,
                                                   @PathVariable Long noticeId,
                                                   @AuthenticationPrincipal UserDetails userDetails) {

        noticeService.registerNoticeComment(noticeId, requestDto, userDetails.getUsername());

        return ResponseEntity.ok().body("Comment registered successfully");
    }

    @GetMapping("/comment/{noticeId}")
    @Operation(summary = "댓글 조회", description = "댓글을 조회합니다.")
    public ResponseEntity<?> getComment(@PathVariable Long noticeId, @AuthenticationPrincipal UserDetails userDetails) {

        boolean isAdmin = false;

        if (userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
            isAdmin = true;
        }

        List<NoticeCommentResponse> comments = noticeService.getListNoticeComment(noticeId, userDetails.getUsername(), isAdmin);
        return ResponseEntity.ok(comments);
    }

    @DeleteMapping("/comment/delete/{commentId}")
    @Operation(summary = "댓글 삭제", description = "댓글을 삭제합니다.")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId, @AuthenticationPrincipal UserDetails userDetails) {

        boolean isAdmin = false;

        if (userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
            isAdmin = true;
        }

        noticeService.deleteNoticeComment(commentId, isAdmin, userDetails.getUsername());
        return ResponseEntity.ok().body("Comment deleted successfully");
    }

    @PutMapping("/comment/update/{commentId}")
    @Operation(summary = "댓글 수정", description = "댓글을 수정합니다.")
    public ResponseEntity<?> updateComment(@PathVariable Long commentId,
                                           @AuthenticationPrincipal UserDetails userDetails,
                                           @RequestBody NoticeCommentRequest requestDto) {

        boolean isAdmin = false;

        if (userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
            isAdmin = true;
        }

        noticeService.updateNoticeComment(commentId, requestDto, userDetails.getUsername(), isAdmin);
        return ResponseEntity.ok().body("Comment updated successfully");
    }

    // 첨부파일 다운로드
    @GetMapping("/download/{fileId}")
    @Operation(summary = "첨부파일 다운로드", description = "첨부파일을 다운로드합니다.")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) {
        NoticeImage noticeFile = noticeService.getNoticeFileById(fileId);
        Resource file = noticeService.loadFileAsResource(noticeFile);

        String contentType = determineContentType(file);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + noticeFile.getOriginalFilename() + "\"")
                .body(file);
    }

    private String determineContentType(Resource resource) {
        try {
            return Files.probeContentType(resource.getFile().toPath());
        } catch (IOException ex) {
            throw new RuntimeException("Could not determine file type.", ex);
        }
    }
}
