package com.__105.Banchan.vote.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoteResultDto {

    private Long voteId;
    private String title;
    private String content;
    private List<QuestionResultDto> questionResults;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionResultDto {
        private Long questionId;
        private String questionText;
        private List<OptionResultDto> optionResults;
    }

    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OptionResultDto {
        private Long optionId;
        private String optionText;
        private Long voteCount;
    }
}
