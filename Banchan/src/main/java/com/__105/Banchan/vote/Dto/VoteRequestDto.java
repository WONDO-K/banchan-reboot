package com.__105.Banchan.vote.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoteRequestDto {

    private String title;
    private String content;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<QuestionDto> questions;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionDto {

        private String questionText;

        private List<String> options;
    }
}
