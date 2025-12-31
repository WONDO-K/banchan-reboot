package com.__105.Banchan.vote.controller;

import com.__105.Banchan.vote.Dto.*;
import com.__105.Banchan.vote.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/votes")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    @PostMapping("/regist")
    public ResponseEntity<?> registVote(@RequestBody VoteRequestDto voteRequestDto,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        voteService.createVote(voteRequestDto, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    // 투표 상세 조회
    @GetMapping("/detail/{voteId}")
    public ResponseEntity<?> detail(@PathVariable Long voteId) {
        VoteResponseDto voteResponseDto = voteService.getVoteWithDetails(voteId);
        return ResponseEntity.ok().body(voteResponseDto);
    }

    // 현재 진행 중인 투표 목록 조회
    @GetMapping("/list/current")
    public ResponseEntity<?> listCurrent(@AuthenticationPrincipal UserDetails userDetails) {

        List<VoteListResponseDto> votes = voteService.getCurrentVoteList(userDetails.getUsername());
        return ResponseEntity.ok().body(new DataResponse<>(votes));
    }

    // 투표 완료된 투표 목록 조회
    @GetMapping("/list/finished")
    public ResponseEntity<?> listFinished(@AuthenticationPrincipal UserDetails userDetails) {

        List<VoteListResponseDto> votes = voteService.getlistFinished(userDetails.getUsername());
        return ResponseEntity.ok().body(new DataResponse<>(votes));
    }

    // 투표 결과 조회
    @GetMapping("/result/{voteId}")
    public ResponseEntity<?> result(@PathVariable Long voteId) {
        VoteResultDto result = voteService.getResult(voteId);
        return ResponseEntity.ok().body(result);
    }

    // 투표 하기
    @PostMapping("/vote")
    public ResponseEntity<?> vote(@RequestBody DoVoteRequestDto voteRequestDto,
                                  @AuthenticationPrincipal UserDetails userDetails) {

        voteService.vote(voteRequestDto, userDetails.getUsername());
        return ResponseEntity.ok().body("success vote");
    }

    @DeleteMapping("/delete/{voteId}")
    public ResponseEntity<?> delete(@PathVariable Long voteId,
                                    @AuthenticationPrincipal UserDetails userDetails) {

        voteService.deleteVote(voteId);
        return ResponseEntity.ok().body("success delete");
    }
}
