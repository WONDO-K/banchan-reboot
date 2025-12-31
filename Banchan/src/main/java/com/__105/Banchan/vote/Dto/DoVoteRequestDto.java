package com.__105.Banchan.vote.Dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DoVoteRequestDto {

    private Long voteId;
    private List<ResponseDto> responses;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponseDto {
        private Long questionId;
        private Long optionId;
    }
}
