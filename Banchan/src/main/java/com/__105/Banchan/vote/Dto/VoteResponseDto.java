package com.__105.Banchan.vote.Dto;

import com.__105.Banchan.vote.Entity.Vote;
import com.__105.Banchan.vote.Entity.VoteOption;
import com.__105.Banchan.vote.Entity.VoteQuestion;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class VoteResponseDto {

    private Long id;
    private String title;
    private String content;
    private String imageUrl;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private int voteCount;
    private int finishCount;
    private List<QuestionResponseDto> questions;

    public VoteResponseDto(Vote vote, int voteCount, int finishCount) {
        this.id = vote.getId();
        this.title = vote.getTitle();
        this.content = vote.getContent();
        this.imageUrl = vote.getImageUrl();
        this.startDate = vote.getStartDate();
        this.endDate = vote.getEndDate();
        this.createdAt = vote.getCreatedAt();
        this.voteCount = voteCount;
        this.finishCount = finishCount;
        this.questions = vote.getQuestions().stream()
                .map(QuestionResponseDto::new)
                .collect(Collectors.toList());
    }

    @Getter
    public static class QuestionResponseDto {

        private Long questionId;
        private String questionText;
        private List<OptionResponseDto> options;

        public QuestionResponseDto(VoteQuestion question) {
            this.questionId = question.getId();
            this.questionText = question.getQuestionText();
            this.options = question.getOptions().stream()
                    .map(OptionResponseDto::new)
                    .collect(Collectors.toList());
        }
    }

    @Getter

    public static class OptionResponseDto {

        private Long id;
        private String optionText;


        public OptionResponseDto(VoteOption voteOption) {
            this.id = voteOption.getId();
            this.optionText = voteOption.getOptionText();
        }
    }

}
