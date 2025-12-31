package com.__105.Banchan.vote.service;

import com.__105.Banchan.vote.Dto.*;

import java.util.List;

public interface VoteService {

    void createVote(VoteRequestDto voteRequestDto, String username);

    VoteResponseDto getVoteWithDetails(Long voteId);

    List<VoteListResponseDto> getCurrentVoteList(String username);

    List<VoteListResponseDto> getlistFinished(String username);

    void vote(DoVoteRequestDto doVoteRequestDto, String username);

    VoteResultDto getResult(Long voteId);

    void deleteVote(Long voteId);
}
