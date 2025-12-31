package com.__105.Banchan.ask.controller;

import com.__105.Banchan.ask.dto.*;
import com.__105.Banchan.ask.servie.AskService;
import com.__105.Banchan.notice.dto.SearchCondition;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ask")
@RequiredArgsConstructor
public class AskController {

    private final AskService askService;

    @PostMapping("/regist")
    @Operation(summary = "문의 등록", description = "문의를 등록합니다.")
    public ResponseEntity<?> registAsk(@RequestBody AskPostRequest requestDto,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        askService.registAsk(requestDto, userDetails.getUsername());
        return ResponseEntity.ok().body("Ask registered successfully");
    }

    @GetMapping("/detail/{askId}")
    @Operation(summary = "문의 상세 조회", description = "문의 상세 정보를 조회합니다.")
    public ResponseEntity<?> detailAsk(@PathVariable Long askId,
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

        Optional<Cookie> askCookie = Arrays.stream(cookies)
                .filter(cookie -> cookie.getName().equals("viewed_ask"))
                .findFirst();

        if (askCookie.isPresent()) {
            String decodedValue = new String(Base64.getDecoder().decode(askCookie.get().getValue()));
            String[] viewedNotices = decodedValue.split(",");
            isViewed = Arrays.asList(viewedNotices).contains(askId.toString());
        }

        AskDetailResponse responseDto;

        if (!isViewed) {
            String newCookieValue = askCookie.map(cookie -> new String(Base64.getDecoder().decode(cookie.getValue())) + "," + askId)
                    .orElse(askId.toString());
            String encodedValue = Base64.getEncoder().encodeToString(newCookieValue.getBytes());
            Cookie newCookie = new Cookie("viewed_ask", encodedValue);

            newCookie.setPath("/");
            newCookie.setMaxAge(60 * 10);
            response.addCookie(newCookie);

            responseDto = askService.detailAsk(askId, userDetails.getUsername(), isAdmin, false);
        } else {
            responseDto = askService.detailAsk(askId, userDetails.getUsername(), isAdmin, true);
        }

        return ResponseEntity.ok().body(responseDto);
    }

    @DeleteMapping("/delete/{askId}")
    @Operation(summary = "문의 삭제", description = "문의를 삭제합니다.")
    public ResponseEntity<?> deleteAsk(@PathVariable Long askId,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        boolean isAdmin = false;

        if (userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
            isAdmin = true;
        }

        askService.deleteAsk(askId, isAdmin, userDetails.getUsername());

        return ResponseEntity.ok().body("Ask deleted successfully");
    }

    @PutMapping("/update/{askId}")
    @Operation(summary = "문의 수정", description = "문의를 수정합니다.")
    public ResponseEntity<?> updateAsk(@PathVariable Long askId,
                                       @RequestBody AskPostRequest requestDto,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        boolean isAdmin = false;

        if (userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
            isAdmin = true;
        }

        askService.updateAsk(askId, requestDto, isAdmin, userDetails.getUsername());

        return ResponseEntity.ok().body("Ask updated successfully");
    }

    @GetMapping("/list")
    @Operation(summary = "문의 목록 조회", description = "문의 목록을 조회합니다.")
    public ResponseEntity<?> listAsks(@AuthenticationPrincipal UserDetails userDetails,
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

        Page<AskListResponse> asks = askService.getListAsk(searchCondition, userDetails.getUsername());
        return ResponseEntity.ok().body(asks);
    }

    @PostMapping("/comment/regist/{askId}")
    @Operation(summary = "문의 댓글 등록", description = "문의에 댓글을 등록합니다.")
    public ResponseEntity<?> registComment(@RequestBody AskCommentRequest request,
                                           @PathVariable Long askId,
                                           @AuthenticationPrincipal UserDetails userDetails) {

        askService.registAskComment(askId, request, userDetails.getUsername());

        return ResponseEntity.ok().body("Ask Comment registered successfully");
    }

    @GetMapping("/comment/{askId}")
    @Operation(summary = "문의 댓글 조회", description = "문의에 등록된 댓글을 조회합니다.")
    public ResponseEntity<?> getComment(@PathVariable Long askId, @AuthenticationPrincipal UserDetails userDetails) {

        boolean isAdmin = false;

        if (userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
            isAdmin = true;
        }

        List<AskCommentResponse> comments = askService.getListAskComment(askId, userDetails.getUsername(), isAdmin);

        return ResponseEntity.ok().body(comments);
    }

    @DeleteMapping("/comment/delete/{commentId}")
    @Operation(summary = "문의 댓글 삭제", description = "문의 댓글을 삭제합니다.")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId, @AuthenticationPrincipal UserDetails userDetails) {
        boolean isAdmin = false;
        if (userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
            isAdmin = true;
        }

        askService.deleteAskComment(commentId, isAdmin, userDetails.getUsername());

        return ResponseEntity.ok().body("Ask Comment deleted successfully");
    }

    @PutMapping("/comment/update/{commentId}")
    @Operation(summary = "문의 댓글 수정", description = "문의 댓글을 수정합니다.")
    public ResponseEntity<?> updateComment(@PathVariable Long commentId,
                                           @AuthenticationPrincipal UserDetails userDetails,
                                           @RequestBody AskCommentRequest requestDto) {
        boolean isAdmin = false;

        if (userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
            isAdmin = true;
        }

        askService.updateAskComment(commentId, requestDto, userDetails.getUsername(), isAdmin);
        return ResponseEntity.ok().body("Ask Comment updated successfully");
    }

    @GetMapping("/like/{askId}")
    @Operation(summary = "문의 좋아요", description = "문의에 좋아요를 누릅니다.")
    public ResponseEntity<?> likeAsk(@PathVariable Long askId, @AuthenticationPrincipal UserDetails userDetails) {

        askService.likeAsk(askId, userDetails.getUsername());
        return ResponseEntity.ok().body("Ask Like successfully");
    }

    @GetMapping("/unlike/{askId}")
    @Operation(summary = "문의 좋아요 취소", description = "문의에 좋아요를 취소합니다.")
    public ResponseEntity<?> unlikeAsk(@PathVariable Long askId, @AuthenticationPrincipal UserDetails userDetails) {

        askService.unlikeAsk(askId, userDetails.getUsername());
        return ResponseEntity.ok().body("Ask Unlike successfully");
    }

}
